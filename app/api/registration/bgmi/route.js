import { NextResponse } from "next/server";
import {
  addEvent,
  addTransaction,
  countEvents,
  ErrorResponse,
  getEvents,
  getPool,
  hasRecord,
  insertBGMIRegistration,
  insertRegistration,
  SuccessResponse,
} from "../../../../lib/db";

export async function POST(req) {
  return NextResponse.json({type:"error", message:"Sorry, BGMI Badshah registration are closed !"});
  const pool = await getPool();
  const {
    branch,
    department,
    email,
    gender,
    phone,
    player2 = "",
    player3 = "",
    player4 = "",
    rollno,
    semester,
    team_leader,
    team_name,
    transaction_id,
    year,
  } = await req.json();

  try {
    // Check if the user already has a record in the database
    const recordExists = await hasRecord(pool, rollno);
    if (recordExists) {
      // couting number of events registered in
      let [ge_error, events] = await getEvents(pool, rollno);
      if (ge_error)
        return NextResponse.json({ type: "error", message: ge_error.message });

      const eventCount = events.length;
      if (eventCount >= 2) {
        return NextResponse.json({
          type: "error",
          message: "Already in two events : " + events.join(" and "),
        });
      }

      console.log({ events });
      if (Array.isArray(events) && events.includes("BGMI BADSHAH"))
        return NextResponse.json({
          type: "error",
          message: `Already Registered in 'BGMI BADSHAH'`,
        });

      // adding transition id with error checking
      if (department !== "UIT") {
        let t_error = await addTransaction(pool, {
          transaction_id,
          rollno,
          event: "BGMI BADSHAH",
          amount: 200,
          verified: department === "UIT",
        });
        if (t_error) return ErrorResponse(t_error);
      }

      // adding event to selectedEvent
      let e_error = await addEvent(pool, rollno, "BGMI BADSHAH");
      if (e_error) return ErrorResponse(e_error);
      return SuccessResponse("BGMI BADSHAH registration done")
    }

    // create new entry
    let i_error = await insertBGMIRegistration(pool, {
      rollno,
      team_leader,
      player2,
      player3,
      player4,
      team_name,
    });
    if (i_error) return ErrorResponse(i_error);

    let r_error = await insertRegistration(pool, {
      rollno,
      email,

      firstname: team_leader,
      lastname: " ",
      branch,

      department,
      year,
      phone,

      event: ["BGMI BADSHAH"],
      gender,
      semester,
    });
    if (r_error) return ErrorResponse(r_error);

    // insert new transaction;
    if (department !== "UIT") {
      let it_error = await addTransaction(pool, {
        transaction_id,
        rollno,
        event: "BGMI BADSHAH",
        amount: 200,
        verified: department === "UIT",
      });
      if (it_error) return ErrorResponse(it_error);
    }
    return SuccessResponse("Entry Added");
  } catch (e) {
    console.error("Error creating record:", e);
    return NextResponse.json({ type: "error", message: e.message });
  }
}


export async function GET(req) {
  const adminCookie = req.cookies.get("admin")?.value;
  
  // checking for authorization
  if (!adminCookie || adminCookie !== (process.env.ADMIN_KEY || "admin-key"))
    return NextResponse.json(
      { message: "Unauthorized access" },
      { status: 401 } // 401 Unauthorized status
    );

  try {
    // Query to select all registrations from the table
    const result = await getRegistrations();

    // Return the result as JSON
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching registrations:", error);

    // Return an error response
    return NextResponse.json(
      { message: "Error fetching registrations" },
      { status: 500 }
    );
  }
}