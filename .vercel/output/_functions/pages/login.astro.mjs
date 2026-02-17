import { e as createComponent, k as renderComponent, r as renderTemplate, m as maybeRenderHead } from '../chunks/astro/server_D0FKrmaD.mjs';
import { L as LanguageProvider, u as useTranslation, $ as $$Layout } from '../chunks/i18n_BgOPVVWt.mjs';
import { jsx, jsxs } from 'react/jsx-runtime';
import * as React from 'react';
import { useState, useRef, useCallback, useEffect } from 'react';
import { c as cn, I as Input, B as Button } from '../chunks/input_DaDLUbK_.mjs';
import { u as useToast } from '../chunks/use-toast_DpGr9H6u.mjs';
/* empty css                                      */
export { renderers } from '../renderers.mjs';

const Card = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn(
      "rounded-xl border bg-card text-card-foreground shadow",
      className
    ),
    ...props
  }
));
Card.displayName = "Card";
const CardHeader = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex flex-col space-y-1.5 p-6", className),
    ...props
  }
));
CardHeader.displayName = "CardHeader";
const CardTitle = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "h3",
  {
    ref,
    className: cn("font-semibold leading-none tracking-tight", className),
    ...props
  }
));
CardTitle.displayName = "CardTitle";
const CardDescription = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "p",
  {
    ref,
    className: cn("text-sm text-muted-foreground", className),
    ...props
  }
));
CardDescription.displayName = "CardDescription";
const CardContent = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx("div", { ref, className: cn("p-6 pt-0", className), ...props }));
CardContent.displayName = "CardContent";
const CardFooter = React.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ jsx(
  "div",
  {
    ref,
    className: cn("flex items-center p-6 pt-0", className),
    ...props
  }
));
CardFooter.displayName = "CardFooter";

function LoginFormContent() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [securityPhrase, setSecurityPhrase] = useState("");
  const [twoFactorCode, setTwoFactorCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [securityQuestion, setSecurityQuestion] = useState("");
  const [questionNumber, setQuestionNumber] = useState(null);
  const [userId, setUserId] = useState(null);
  const [qrCode, setQrCode] = useState(null);
  const [needs2FASetup, setNeeds2FASetup] = useState(false);
  const [captchaToken, setCaptchaToken] = useState(null);
  const { toast } = useToast();
  const { t } = useTranslation();
  const turnstileRef = useRef(null);
  const turnstileWidgetId = useRef(null);
  const onCaptchaVerify = useCallback((token) => {
    setCaptchaToken(token);
  }, []);
  useEffect(() => {
    let intervalId;
    const initTurnstile = () => {
      if (typeof window !== "undefined" && window.turnstile && turnstileRef.current) {
        if (turnstileWidgetId.current) {
          window.turnstile.remove(turnstileWidgetId.current);
        }
        turnstileWidgetId.current = window.turnstile.render(turnstileRef.current, {
          sitekey: "0x4AAAAAAAzKBhv-4rkZ0cjz",
          callback: onCaptchaVerify
        });
        clearInterval(intervalId);
      }
    };
    initTurnstile();
    if (!turnstileWidgetId.current) {
      intervalId = setInterval(initTurnstile, 100);
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
      if (turnstileWidgetId.current && window.turnstile) {
        window.turnstile.remove(turnstileWidgetId.current);
      }
    };
  }, [onCaptchaVerify]);
  const handleFirstStep = async (e) => {
    e.preventDefault();
    if (!captchaToken) {
      toast({
        title: t("Error"),
        description: "Please complete the captcha",
        variant: "destructive"
      });
      return;
    }
    setIsLoading(true);
    try {
      const response = await fetch("/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username,
          password,
          "cf-turnstile-response": captchaToken
        })
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t("Error"));
      }
      setSecurityQuestion(data.securityQuestion);
      setQuestionNumber(data.questionNumber);
      setStep(2);
    } catch (error) {
      toast({
        title: t("Error"),
        description: error instanceof Error ? error.message : t("Error"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
      if (window.turnstile && turnstileWidgetId.current) {
        window.turnstile.reset(turnstileWidgetId.current);
      }
      setCaptchaToken(null);
    }
  };
  const handleSecondStep = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/auth/protected", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          securityPhrase,
          questionNumber
        }),
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t("Error"));
      }
      setUserId(data.userId);
      if (data.requires2FA) {
        setNeeds2FASetup(!data.totp_enabled);
        if (!data.totp_enabled) {
          const setupResponse = await fetch("/api/auth/setup-2fa", {
            method: "POST",
            credentials: "include"
          });
          if (setupResponse.ok) {
            const setupData = await setupResponse.json();
            setQrCode(setupData.qrCode);
          }
        }
        setStep(3);
      } else {
        window.location.href = "/panel-admin";
      }
    } catch (error) {
      toast({
        title: t("Error"),
        description: error instanceof Error ? error.message : t("Error"),
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  const handleThirdStep = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: twoFactorCode,
          userId
        }),
        credentials: "include"
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || t("2FA-Error"));
      }
      window.location.href = "/panel-admin";
    } catch (error) {
      toast({
        title: t("Error"),
        description: error instanceof Error ? error.message : t("2FA-Error"),
        variant: "destructive"
      });
      setTwoFactorCode("");
    } finally {
      setIsLoading(false);
    }
  };
  return /* @__PURE__ */ jsxs(Card, { className: "w-full max-w-md mx-auto bg-white dark:bg-gray-800 shadow-lg", children: [
    /* @__PURE__ */ jsxs(CardHeader, { className: "bg-gray-50 dark:bg-gray-900 rounded-t-lg", children: [
      /* @__PURE__ */ jsx(CardTitle, { className: "mb-2 text-2xl font-bold text-gray-800 dark:text-white", children: step === 3 ? t("2FA-Title") : t("L-Login") }),
      /* @__PURE__ */ jsxs(CardDescription, { className: "text-gray-600 dark:text-gray-300", children: [
        step === 1 && t("L-Subtitle"),
        step === 2 && securityQuestion,
        step === 3 && (needs2FASetup ? t("2FA-Setup") : t("2FA-Enter"))
      ] })
    ] }),
    /* @__PURE__ */ jsxs(CardContent, { className: "p-6", children: [
      step === 1 && /* @__PURE__ */ jsxs("form", { onSubmit: handleFirstStep, className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            placeholder: t("L-User"),
            value: username,
            onChange: (e) => setUsername(e.target.value),
            required: true,
            className: "w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "mb-4", children: /* @__PURE__ */ jsx(
          Input,
          {
            type: "password",
            placeholder: t("L-Password"),
            value: password,
            onChange: (e) => setPassword(e.target.value),
            required: true,
            className: "w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          }
        ) }),
        /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-[48%] bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700",
            disabled: isLoading || !captchaToken,
            children: isLoading ? t("Process1") : t("L-Next")
          }
        ) }),
        /* @__PURE__ */ jsx("div", { ref: turnstileRef, className: "mt-4 flex justify-center w-full h-[50px]" })
      ] }),
      step === 2 && /* @__PURE__ */ jsxs("form", { onSubmit: handleSecondStep, className: "space-y-4", children: [
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            placeholder: t("L-SecurityP"),
            value: securityPhrase,
            onChange: (e) => setSecurityPhrase(e.target.value),
            required: true,
            className: "w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          }
        ) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700",
            disabled: isLoading,
            children: isLoading ? t("Process1") : t("L-Next")
          }
        )
      ] }),
      step === 3 && /* @__PURE__ */ jsxs("form", { onSubmit: handleThirdStep, className: "space-y-4", children: [
        needs2FASetup && qrCode && /* @__PURE__ */ jsxs("div", { className: "text-center mb-4", children: [
          /* @__PURE__ */ jsx("p", { className: "text-sm text-gray-600 dark:text-gray-300 mb-3", children: t("2FA-Scan") }),
          /* @__PURE__ */ jsx("div", { className: "flex justify-center", children: /* @__PURE__ */ jsx(
            "img",
            {
              src: qrCode,
              alt: "QR Code para 2FA",
              className: "w-48 h-48 rounded-lg shadow-md"
            }
          ) })
        ] }),
        /* @__PURE__ */ jsx("div", { children: /* @__PURE__ */ jsx(
          Input,
          {
            type: "text",
            inputMode: "numeric",
            pattern: "[0-9]*",
            maxLength: 6,
            placeholder: t("2FA-Code"),
            value: twoFactorCode,
            onChange: (e) => setTwoFactorCode(e.target.value.replace(/\D/g, "")),
            required: true,
            className: "w-full px-4 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white text-center text-2xl tracking-widest"
          }
        ) }),
        /* @__PURE__ */ jsx(
          Button,
          {
            type: "submit",
            className: "w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out dark:bg-blue-600 dark:hover:bg-blue-700",
            disabled: isLoading || twoFactorCode.length !== 6,
            children: isLoading ? t("Process1") : t("2FA-Verify")
          }
        )
      ] })
    ] })
  ] });
}
function LoginForm() {
  return /* @__PURE__ */ jsx(LanguageProvider, { children: /* @__PURE__ */ jsx(LoginFormContent, {}) });
}

const $$Login = createComponent(($$result, $$props, $$slots) => {
  return renderTemplate`${renderComponent($$result, "Layout", $$Layout, { "title": "Login" }, { "default": ($$result2) => renderTemplate` ${maybeRenderHead()}<main class="container mx-auto mt-8"> ${renderComponent($$result2, "LoginForm", LoginForm, { "client:load": true, "client:component-hydration": "load", "client:component-path": "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/components/LoginForm.tsx", "client:component-export": "default" })} </main> ` })}`;
}, "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/login.astro", void 0);

const $$file = "C:/Users/arang/Desktop/Importante/SMN - Muestra/src/pages/login.astro";
const $$url = "/login";

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  default: $$Login,
  file: $$file,
  url: $$url
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
