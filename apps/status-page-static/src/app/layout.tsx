import "@/styles/globals.css";

import type { Metadata } from "next";
import { Inter } from "next/font/google";
import LocalFont from "next/font/local";

import { Toaster } from "@/components/ui/sonner";

import {
  defaultMetadata,
  ogMetadata,
  twitterMetadata,
} from "@/app/shared-metadata";
import { TailwindIndicator } from "@/components/tailwind-indicator";
import { ThemeProvider } from "@/components/theme-provider";
import Background from "./_components/background";
import { Header } from "./_components/header";
import { Shell } from "../components/dashboard/shell";
import { Footer } from "./_components/footer";
import page from "../../configurations";
import PasswordProtected from "./_components/password-protected";
import moment from "moment-timezone";

const inter = Inter({ subsets: ["latin"] });

const calSans = LocalFont({
	src: "../public/fonts/CalSans-SemiBold.ttf",
	variable: "--font-calsans",
});

export const metadata: Metadata = {
	...defaultMetadata,
	twitter: {
		...twitterMetadata,
	},
	openGraph: {
		...ogMetadata,
	},
};

function StatusPageLayout({ children }: { children: React.ReactNode }) {
	const params = { domain: "example" };
  
	const navigation = [ // TODO: Params
		{
			label: "Status",
			segment: null,
			href: '/'
		},
		/*{
			label: "Events",
			segment: "events",
			href: '/events',
		},
		{
			label: "Monitors",
			segment: "monitors",
			href: '/monitors',
		},*/
	];

	// TODO: Add API support for this (pain)
	// TODO: move to middleware using NextResponse.rewrite keeping the path without using redirect
	// and move the PasswordProtected into a page.tsx
	if (page.passwordProtected) {
	  // const cookie = cookies();
	  // const protectedCookie = cookie.get(createProtectedCookieKey(params.domain));
	  // const password = protectedCookie ? protectedCookie.value : undefined;
	  //if (password !== page.password) {
		return <PasswordProtected plan={page.workspacePlan} slug={params.domain} />;
	  //}
	}

	return (
		<div className="relative mx-auto flex min-h-screen w-full max-w-4xl flex-col space-y-6 p-4 md:p-8">
			<Header navigation={navigation} plan={page.workspacePlan} page={page} />
			<main className="flex h-full w-full flex-1 flex-col">
				<Shell className="mx-auto h-full flex-1 rounded-2xl px-4 py-4 md:p-8">
					{children}
				</Shell>
			</main>
			<Footer plan={page.workspacePlan} timeZone={moment.tz.guess()} />
		</div>
	);
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
	return (
		<html lang="en">
			<body
				className={`${
				inter.className
				// biome-ignore lint/nursery/useSortedClasses: <explanation>
				} ${calSans.variable}`}
			>
				<ThemeProvider attribute="class" defaultTheme="light" enableSystem>
					<Background>
						<StatusPageLayout>{children}</StatusPageLayout>
					</Background>
					<Toaster richColors closeButton />
					<TailwindIndicator />
				</ThemeProvider>
			</body>
		</html>
	);
}
