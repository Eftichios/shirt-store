import Head from "next/head"
import NavbarTop from "./navbar-top"

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <>
            <Head>
                <title>Shirt Store</title>
                <meta name="description" content="An online store for buying shirts" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <NavbarTop />
            <main className="h-[calc(100%-48px)]">{children}</main>
        </>
    )
}
