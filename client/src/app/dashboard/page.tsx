"use client";
import axios from "axios";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Navbar from "../components/navbar";
import FabricDisplay from "./components/fabricDisplay";
import FabricCard from "./components/fabricCard";
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

export default function Dashboard() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [fabrics, setFabrics] = useState<Fabric[]>([]);
  const [display, setDisplay] = useState("dashboard");
  const [fabricsLoading, setFabricsLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user/dashboard`, {
        withCredentials: true,
      })
      .then((res) => setUser(res.data))
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

  const filteredFabrics = fabrics;

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
    } else {
      router.push(`/${route}`);
    }
  };

  return (
    <main className="main-container min-h-screen bg-gray-100 pt-16 p-4">
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
          <div className="text-center px-7 flex flex-col w-[60%] content-center items-center mx-auto">
            {/* <h2 className="text-2xl mb-4">
              Welcome back to sewjo, {user?.userName}!
            </h2>
            <button
              onClick={handleLogoutClick}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Click here to logout
            </button> */}
            <div className="text-2xl text-left font-semibold mx-30 w-full py-9">
              Fabrics
            </div>

            <div className="flex gap-6 pb-9 overflow-x-scroll w-full">
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

            <div className="text-2xl text-left font-semibold mx-30 w-full py-9">
              Patterns
            </div>
            <div className="flex gap-6 pb-9 overflow-x-scroll w-full">
              {fabricsLoading ? (
                <div className="w-full h-[100px] items-center justify-center flex">
                  <div className="">Loading patterns...</div>
                </div>
              ) : filteredFabrics.length === 0 ? (
                <div className="w-full h-[100px] items-center justify-center flex">
                  <div className="">
                    Oops! No patterns in your collection yet.
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
          </div>
        )}
        {display === "fabrics" && <FabricDisplay />}
        {display === "patterns" && (
          <div className="text-center">
            <h2 className="text-2xl mb-4">Patterns</h2>
            <p>Patterns content goes here...</p>
          </div>
        )}
        {display === "projects" && (
          <div className="text-center">
            <h2 className="text-2xl mb-4">Projects</h2>
            <p>Projects content goes here...</p>
          </div>
        )}
        {display === "changeDetails" && <ChangeDetails />}
      </div>
    </main>
  );
}
