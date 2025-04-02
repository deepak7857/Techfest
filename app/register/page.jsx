"use client";

import { useCallback, useEffect, useState } from "react";
import Input from "../components/input";
import Select from "../components/select";
import Info from "../components/infobox";

export default function Register() {
  const [infoTheme, setInfoTheme] = useState("suggest");
  const [infoText, setInfoText] = useState(" * fields are required");
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const otherDepFee = 50;
  const [formData, setFormData] = useState({ transition_amount: otherDepFee });
  const onSubmit = async (e) => {
    e.preventDefault();
    setInfoTheme("suggest");
    setInfoText("Uploading Form ...");
    setSubmitDisabled(true);

    console.log({ formData });
    try {
      const response = await fetch("/api/registration", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...formData, year: parseInt(formData.year) }),
      });

      if (response.ok) {
        let data = await response.json();
        let {type} = data;
        switch(type){
          case "success":
            setInfoTheme("success");
            setInfoText("Form Submitted Successfully");
            break;
          case "error":
            setInfoTheme("error");
            setInfoText(data.message+" -- Contact US with Error");
            break;
        }
        
      } else {
        console.error("Failed to submit form");
        setInfoTheme("error");
        setInfoText("Error submitting form - Contact us from bottom of page");
        // Handle the error (e.g., show an error message)
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      setInfoTheme("error");
      setInfoText("Error submitting form");
      // Handle the error (e.g., show an error message)
    }

    setSubmitDisabled(false);
  };

  const handleInput = (e) => {
    let { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="w-full grid-bg text-white py-10">
      <form
        onSubmit={onSubmit}
        className="bg-blur w-[95%] mx-auto md:w-[600px] flex flex-col bg-[rgba(255,255,255,0.1)] px-5 lg:px-10 rounded-3xl border border-gray-500"
      >
        <h1 className="text-center text-2xl md:4xl py-10">
          <span className="text-gray-400">Registration Form</span>
        </h1>
        {/* Team Name - Leader */}
        <div className="flex flex-col md:flex-row gap-x-5">
          <Input
            label={"First Name"}
            name={"firstname"}
            onChange={handleInput}
            value={formData["firstname"]}
            className={"flex-1"}
            required
          />
          <Input
            required
            label={"Last Name"}
            name={"lastname"}
            className={"flex-1"}
            onChange={handleInput}
            value={formData["lastname"]}
          />
        </div>
        {/* Player 2 - player 3 */}

        {/* Year - Semester */}
        <div className="flex flex-col md:flex-row gap-x-5">
          <Select
            options={["1st", "2nd", "3rd", "4th", "5th"]}
            label={"Year"}
            name={"year"}
            onChange={handleInput}
            value={formData["year"]}
            className="flex-1"
            required
          />
          <Select
            options={Array.from({ length: 10 }).map((e, i) => i + 1)}
            label={"Semester"}
            name={"semester"}
            onChange={handleInput}
            value={formData["semester"]}
            className="flex-1"
            required
          />
        </div>
        {/* Gender - Email */}
        <div className="flex flex-col md:flex-row gap-x-5">
          <Select
            label={"Gender"}
            name={"gender"}
            options={["Male", "Female", "Other"]}
            className={"flex-1"}
            onChange={handleInput}
            value={formData["gender"]}
            required
          />
          <Input
            label={"University Roll No."}
            name={"rollno"}
            className={"flex-1"}
            type="number"
            onChange={handleInput}
            value={formData["rollno"]}
            required
          />
        </div>

        {/* Phone - email */}
        <div className="flex flex-col md:flex-row gap-x-5">
          <Input
            label={"Email"}
            name={"email"}
            className={"flex-1"}
            type="email"
            onChange={handleInput}
            value={formData["email"]}
            required
          />
          <Input
            className={"flex-1"}
            type="number"
            label={"Phone"}
            value={formData["phone"]}
            onChange={handleInput}
            name="phone"
            required
          />
        </div>

        {/* Department - Branch */}
        <div className="flex flex-col md:flex-row gap-x-5">
          <Select
            options={departments}
            label={"Department"}
            name={"department"}
            onChange={handleInput}
            value={formData["department"]}
            className="flex-1"
            required
          />
          <Input
            className={"flex-1"}
            label={"Branch"}
            value={formData["branch"]}
            onChange={handleInput}
            name="branch"
            placeholder={"eg. BCA"}
            required
          />
        </div>

        {/* Event selectoin */}
        <div className="flex flex-col md:flex-row gap-x-5">
          <Select
            options={events}
            label={"Select an Event"}
            name={"event"}
            onChange={handleInput}
            value={formData["event"]}
            className="flex-1"
            required
          />
        </div>

        {/* Price - ScreenShot */}
        <div className="flex flex-col md:flex-row gap-x-5">
          <div className="flex-1 flex-shrink mb-2">
            <div className="text-white mb-2">Charges</div>
            <div className="text-gray-300 flex-1 h-[40px] border flex items-center justify-center border-[#444] rounded text-center">
              {formData["department"]
                ? formData["department"] === "UIT"
                  ? "FREE"
                  : `Rs. ${otherDepFee}`
                : "Choose a Department first"}
            </div>
          </div>
          <div className="flex-1"></div>
        </div>

        {/* Payment screenshot */}
        <div className="flex flex-col mt-2">
          {formData["department"] && formData["department"] != "UIT" && (
            <>
              <div className="mb-2">Scan this QR and Upload the Screenshot</div>
              <img
                src="/payment-qr.jpg"
                className="w-full md:w-[50%] mx-auto rounded"
              />
              <Input
                className={"mt-3"}
                label={"Transaction ID"}
                name={"transaction_id"}
                value={formData["transaction_id"]}
                onChange={handleInput}
                required
              />
            </>
          )}
        </div>

        <Info
          theme={infoTheme}
          onClose={() => setInfoTheme("none")}
          text={infoText}
        />

        {/* SUbmit button */}
        <div className="my-4 flex">
          <button disabled={submitDisabled} className="hover:bg-[#223] px-10 py-3 border-gray-700 border bg-[#00000088] text-white rounded-lg flex-1 md:flex-none  focus:outline-none focus:ring-[3px] focus:ring-blue-600 focus:border-transparent active:scale-90 transition-none ">
            Submit
          </button>
        </div>
      </form>
    </div>
  );
}

const departments = [
  "UIT",
  "USCS",
  "SALS",
  "SLA",
  "UIPS",
  "LCD",
  "UIM",
  "USHHM",
  "USJMC",
  "UCN",
  "USHS",
  "SOA",
];

const events = [
  "Face Painting",
  "Robo Race",
  "Website making competition",
  "Boat Race",
  "Painting",
  "Engineers' Day Fun Run",
  "Technical Quiz Competition",
  "Video Creation",
  "Model Presentation",
  "Cosplay",
  "CODING WAR",
  "Anime creation",
  "Cook Without Fire",
];
