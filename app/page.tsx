import { Hero } from "@/components/home/Hero";
import { Lineup } from "@/components/home/Lineup";
import { Advantages } from "@/components/home/Advantages";
import {
  Comparison,
  ConfiguratorBand,
  Deliveries,
  FaqTeaser,
  OnTheRoad,
  Process,
} from "@/components/home/Sections";
import { JsonLd } from "@/components/JsonLd";
import { site } from "@/content/site";
import { siteUrl } from "@/lib/format";

export default function Home() {
  const url = siteUrl();
  return (
    <>
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@graph": [
            {
              "@type": "Organization",
              "@id": `${url}/#organizacion`,
              name: site.name,
              url,
              logo: `${url}/images/ig/logo.png`,
              description: site.description,
              sameAs: [site.instagram.url],
              ...(site.location && {
                address: {
                  "@type": "PostalAddress",
                  addressLocality: "Buenos Aires",
                  addressCountry: "AR",
                },
              }),
            },
          ],
        }}
      />
      <Hero />
      <Lineup />
      <Advantages />
      <ConfiguratorBand />
      <Comparison />
      <Process />
      <OnTheRoad />
      <Deliveries />
      <FaqTeaser />
    </>
  );
}
