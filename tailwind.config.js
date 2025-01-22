/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgba(var(--background))",
        border: "rgba(var(--border))",
        card: "rgba(var(--card))",
        "copy-primary": "rgba(var(--copy-primary))",
        "copy-secondary": "rgba(var(--copy-secondary))",
        cta: "rgba(var(--cta))",
        "cta-active": "rgba(var(--cta-active))",
        "cta-text": "rgba(var(--cta-text))",
        dashboard:"rgba(var(--dashboard-bg))",
        grape: "rgba(var(--grape))",
        Primary:"rgba(var(--blue-primary))"
      },
    },
    container:{
      center:true,
      padding:{
        DEFAULT:'1rem',
        sm:'2rem',
        lg:'4rem',
        xl:'5rem',
        '2xl':'6rem'
      }
    }
  },
  plugins: [],
};
/*
extend: {
colors:{
  sidebar:{
    active:"#6b32ec",
    bacground:"#f5f5ff",
    iconColor:"636c80"
  }
}
}
*/
/*
className="text-sidebar-active"
*/
