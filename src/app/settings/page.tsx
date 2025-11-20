"use client";

import { redirect } from "next/navigation";
import { useUserContext } from "../context";
import Loading from "../loading";
import Height from "./height";
import MeasurementLog from "./measurement";

export default function Settings() {
	const user = useUserContext();

	if (user.loading) return <Loading />;
	if (!user.isSignedIn) return redirect("/");
	return (
		<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
			<Height />
			<MeasurementLog />
		</div>
	);
}
