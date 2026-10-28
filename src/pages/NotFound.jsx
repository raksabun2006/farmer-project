import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const NotFound = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center select-none font-siemreap">
      {/* Ultra-minimal status */}
      <h1 className="text-7xl font-light text-slate-300 tracking-wider">
        404
      </h1>

      {/* Clean, simple typography */}
      <div className="mt-4 space-y-1">
        <h2 className="text-lg font-bold text-slate-800">
          {t("notFound")}
        </h2>
        <p className="text-xs text-slate-400 uppercase tracking-wide">
          {t("notFound")}
        </p>
      </div>


      <div className="mt-8 flex items-center gap-6 text-xs font-medium">
        <button
          onClick={() => navigate(-1)}
          className="text-slate-500 hover:text-slate-800 transition cursor-pointer"
        >
          {t("backHome")}
        </button>
        <span className="text-slate-200">|</span>
        <button
          onClick={() => navigate("/")}
          className="text-emerald-600 hover:text-emerald-700 font-bold transition cursor-pointer"
        >
          {t("returnHome")}
        </button>
      </div>
    </div>
  );
};

export default NotFound;