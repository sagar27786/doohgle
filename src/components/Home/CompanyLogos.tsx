import LogoLoop from "./LogoLoop";

const companies = [
  {
    name: "AMD",
    src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e458c70e8d765dc3ec_Client-AMD.png",
  },
  {
    name: "Bosch",
    src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba707a7773be8149f6a1b_Client-Bosch.png",
  },
  {
    name: "eBay",
    src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba7076e3994a2509f8bd6_Client-ebay.png",
  },
  {
    name: "Lufthansa",
    src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba7076a090db4dcc19910_Client-lufthansa.png",
  },
  {
    name: "Porsche",
    src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4517c29fc66589736_Client-Porsche.png",
  },
  {
    name: "Personio",
    src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4c81aee2b62b83ea6_Client-Personio.png",
  },
  {
    name: "Vodafone",
    src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4b3664fdd17b98ef3_Client-Vodafone.png",
  },
  {
    name: "Sixt",
    src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4f5b551303452e5e4_Client-Sixt.png",
  },
  {
    name: "RedBull",
    src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4d9d0bc4af3378617_Client-RedBull.png",
  },
  {
    name: "Tommy Hilfiger",
    src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4d8236631fc81cd7e_Client-Tommy-Hilfiger.png",
  },
];

function CompanyLogos() {
  return (
    <div
      className="pt-10"
      style={{ height: "200px", position: "relative", overflow: "hidden" }}
    >
      <LogoLoop
        logos={companies}
        speed={100}
        direction="left"
        logoHeight={100}
        gap={40}
        pauseOnHover
        scaleOnHover
        fadeOut
        fadeOutColor="#ffffff"
        ariaLabel="Technology partners"
      />
    </div>
  );
}

export default CompanyLogos;
