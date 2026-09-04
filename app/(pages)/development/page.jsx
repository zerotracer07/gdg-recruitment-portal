import React from "react";
import Link from "next/link";
import NavBar from "@/components/NavBar";
import DeptHero from "@/components/DeptHero";

const features = [
    {
        name: "App Development",
        description:
            "Build mobile apps and learn real-world workflows.",
        href: "/join/339f0f8a-72f2-44b9-92ab-2b0d4dcfa0f6",
        cta: "Apply",
    },
    {
        name: "Web Development",
        description:
            "Build responsive websites with modern web tech.",
        href: "/join/8143de1d-db17-42fa-958d-13b10804f894",
        cta: "Apply",
    },
];

const page = () => {
    return (
        <main>
            <NavBar />
            <DeptHero dept={{ name: "Development Departments" }} />

            <div>
                <ul>
                    {features.map((feature) => (
                        <li key={feature.name}>
                            <h2>{feature.name}</h2>
                            <p>{feature.description}</p>
                            <Link href={feature.href}>{feature.cta}</Link>
                        </li>
                    ))}
                </ul>
            </div>
        </main>
    );
};

export default page;
