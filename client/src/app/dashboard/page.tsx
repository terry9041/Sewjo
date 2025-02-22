"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import FabricDisplay from "./components/fabricDisplay";
import PatternDisplay from "./components/patternDisplay";
import ProjectDisplay from "./components/projectDisplay";
import FabricCard from "./components/fabricCard";
import PatternCard from "./components/patternCard";
import ChangeDetails from "./components/changeDetails";

/**
 * The dashboard screen which the user sees after logging in
 * @returns The dashboard screen
 */
interface Fabric {
  id: number;
  name: string;
  imageId: number;
  description: string;
  length: number;
  lengthInMeters: boolean;
  width: number;
  widthInCentimeters: boolean;
}
interface Pattern {
  id: number;
  name: string;
  imageId: number;
  description: string;
  patternType: string;
  sizeRange: string;
}

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [patterns, setPatterns] = useState<Pattern[]>([]);
  const [display, setDisplay] = useState("dashboard");
  const [fabricsLoading, setFabricsLoading] = useState(true);
  const [patternsLoading, setPatternsLoading] = useState(true);
  const [updateDashboard, setUpdateDashboard] = useState(false);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard`, {
        withCredentials: true,
      })
      // .then((res) => setUser(res.data))
      .then((res) => {
        setUser(res.data);
        console.log("User:", res.data);
      })
      .catch((err) => router.push("/auth"));
  }, [router]);

  useEffect(() => {
    const fetchFabrics = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/fabric/all`,
          { withCredentials: true }
        );
        setFabrics(response.data);
        setFabricsLoading(false);
        console.log("Fabrics:", response.data);
      } catch (error) {
        console.error("Error fetching fabrics:", error);
        setFabricsLoading(true);
      }
    };
    fetchFabrics();
  }, []);

  useEffect(() => {
    const fetchPatterns = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/pattern/all`,
          { withCredentials: true }
        );
        setPatterns(response.data);
        setPatternsLoading(false);
        console.log("Patterns:", response.data);
      } catch (error) {
        console.error("Error fetching patterns:", error);
      }
    };
    fetchPatterns();
  }, []);

  const filteredFabrics = fabrics;

  const filteredPatterns = patterns;

  const handleLogoutClick = () => {
    axios
      .post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/logout`,
        {},
        { withCredentials: true }
      )
      .then(() => {
        setUser(null);
        router.push("/");
      })
      .catch((err) => {
        console.error("Logout error:", err);
      });
  };

  const displayHandler = (route: string) => {
    if (route === "patterns") {
      setDisplay("patterns");
    } else if (route === "projects") {
      setDisplay("projects");
    } else if (route === "fabrics") {
      setDisplay("fabrics");
    } else if (route === "changeDetails") {
      setDisplay("changeDetails");
    } else if (route === "dashboard") {
      setDisplay("dashboard");
      
      setUpdateDashboard((prev) => !prev); // Toggle the state to trigger re-render
    } else {
      router.push(`/${route}`);
    }
  };

  

  return (
    <main className="main-container min-h-screen bg-gray-100 pt-16 p-4 overflow-y-scroll">
      {" "}
      {/* Added pt-16 to offset the content */}
      <Navbar
        showFullNav={true}
        isLoggedIn={true}
        user={user}
        displayHandler={displayHandler}
      />
      <div className="mt-8">
        {display === "dashboard" && (
          <div className="text-center px-7 flex flex-col w-full md:w-[80%] max-w-[1000px] content-center items-center mx-auto">
            {/* <h2 className="text-2xl mb-4">
              Welcome back to sewjo, {user?.userName}!
            </h2>
            <button
              onClick={handleLogoutClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Click here to logout
            </button> */}
            <div className="relative text-2xl text-left font-semibold mx-30 w-full my-9 z-10">
              Fabrics
            </div>

            <div className="flex gap-6 pb-9 overflow-x-auto w-full z-50">
              {fabricsLoading ? (
                <div className="w-full h-[100px] items-center justify-center flex">
                  <div className="">Loading fabrics...</div>
                </div>
              ) : filteredFabrics.length === 0 ? (
                <div className="w-full h-[100px] items-center justify-center flex">
                  <div className="">
                    Oops! No fabrics in your collection yet.
                  </div>
                </div>
              ) : (
                filteredFabrics
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((fabric) => (
                    <FabricCard key={fabric.id} fabric={fabric} />
                  ))
              )}
            </div>

            <div className="relative text-2xl text-left font-semibold mx-30 w-full my-9 z-10">
              Patterns
            </div>
            <div className="flex gap-6 pb-9 overflow-x-auto w-full z-50">
              {patternsLoading ? (
                <div className="w-full h-[100px] items-center justify-center flex">
                  <div className="">Loading patterns...</div>
                </div>
              ) : filteredPatterns.length === 0 ? (
                <div className="w-full h-[100px] items-center justify-center flex">
                  <div className="">
                    Oops! No patterns in your collection yet.
                  </div>
                </div>
              ) : (
                filteredPatterns
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((pattern) => (
                    <PatternCard key={pattern.id} pattern={pattern} />
                  ))
              )}
            </div>
          </div>
        )}
        {display === "fabrics" && <FabricDisplay />}
        {display === "patterns" && <PatternDisplay />}
        {display === "projects" && <ProjectDisplay />}
        {display === "changeDetails" && <ChangeDetails />}
      </div>
    </main>
  );
}
