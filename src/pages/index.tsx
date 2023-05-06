import { type NextPage } from "next";
import Head from "next/head";

import ShirtContainer from "~/components/shirt-container";

const Home: NextPage = () => {
    return (
        <>
            <Head>
                <title>Shirt Store</title>
                <meta name="description" content="An online store for buying shirts" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="h-full">
                <ShirtContainer />                    
            </main>
        </>
    );
};

export default Home;

