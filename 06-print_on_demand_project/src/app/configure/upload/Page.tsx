"use  client";

import { cn } from "@/lib/utils";
import React from "react";

const Page = () => {
	return (
		<div
			className={cn(
				"relative h-full flex-1 my-16 w-full rounded-xl bg-gray-900/5 p-2 ring-1 ring-inset ring-gray-900/10 lg:rounded-2xl flex justify-center",
			)}>
			page
		</div>
	);
};

export default Page;
