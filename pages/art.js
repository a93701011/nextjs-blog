import Head from 'next/head';
import Layout, { siteTitle } from '../components/layout';
import Image from 'next/image';
import style from '../styles/art.module.css'
import utilStyles from '../styles/utils.module.css';

export default function Home({ allPostsData }) {
    return (
        <Layout>

            <Head>
                <title>{siteTitle}</title>
            </Head>
            <section className={`${utilStyles.headingMd} ${utilStyles.padding1px}`}>

                <a href="https://nobodyeth.art/">c he-Yu Wu x Nobody Hambody</a>
             
                <Image
                    priority
                    src="/images/blackwhitnobody.jpg"
                    width={640}
                    height={640}
                    layout="responsive"

                />
            </section>
        </Layout>
    );
}