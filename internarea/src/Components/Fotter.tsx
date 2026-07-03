import { Facebook, Twitter, Instagram } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-gray-800 text-white py-12">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <FooterSection title={t("footerInternshipByPlaces")} items={[t("newYork"), t("losAngeles"), t("chicago"), t("sanFrancisco"), t("miami"), t("seattle")]} />
          <FooterSection title={t("footerInternshipByStream")} items={[t("aboutUsItem"), t("careers"), t("press"), t("news"), t("mediaKit"), t("contact")]} />
          <FooterSection title={t("footerJobPlaces")} items={[t("blog"), t("newsletter"), t("events"), t("helpCenter"), t("tutorials"), t("supports")]} links />
          <FooterSection title={t("footerJobsByStreams")} items={[t("startups"), t("enterprise"), t("government"), t("saas"), t("marketplaces"), t("ecommerce")]} links />
        </div>

        <hr className="my-10 border-gray-600" />

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
          <FooterSection title={t("footerAboutUs")} items={[t("startups"), t("enterprise")]} links />
          <FooterSection title={t("footerTeamDiary")} items={[t("startups"), t("enterprise")]} links />
          <FooterSection title={t("footerTermsAndConditions")} items={[t("startups"), t("enterprise")]} links />
          <FooterSection title={t("footerSitemap")} items={[t("startups")]} links />
        </div>

        <div className="mt-10 flex flex-col sm:flex-row justify-between items-center">
          <p className="flex items-center gap-2 border border-white px-4 py-2 rounded-lg cursor-pointer hover:bg-gray-700">
            <i className="bi bi-google-play"></i> {t("footerGetAndroidApp")}
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Facebook className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
            <Twitter className="w-6 h-6 hover:text-blue-400 cursor-pointer" />
            <Instagram className="w-6 h-6 hover:text-pink-400 cursor-pointer" />
          </div>
          <p className="mt-4 sm:mt-0 text-sm text-gray-400">© Copyright 2025. {t("footerAllRightsReserved")}</p>
        </div>
      </div>
    </footer>
  );
}

function FooterSection({ title, items, links }:any) {
  return (
    <div>
      <h3 className="text-sm font-bold text-gray-300">{title}</h3>
      <div className="flex flex-col items-start mt-4 space-y-3">
        {items.map((item:any, index:any) =>
          links ? (
            <a key={index} href="/" className="text-gray-400 hover:text-blue-400 hover:underline">
              {item}
            </a>
          ) : (
            <p key={index} className="text-gray-400 hover:text-blue-400 hover:underline cursor-pointer">
              {item}
            </p>
          )
        )}
      </div>
    </div>
  );
}