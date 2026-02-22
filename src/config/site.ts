import { APP_DESCRIPTION, APP_NAME } from "./constants";

export const siteConfig = {
  name: APP_NAME,
  description: APP_DESCRIPTION,
  nav: {
    main: [
      { label: "Dashboard", href: "/dashboard" },
      { label: "Account", href: "/account" },
    ],
  },
};
