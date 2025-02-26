import "./globals.css";
import { AntdRegistry } from "@ant-design/nextjs-registry";
import StepContextProvider from "./components/context/StepContextProvider";
import Steps from "./components/layout/steps";
import Header from "./components/layout/header";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AntdRegistry>
          <div className="grid grid-cols-12 gap-20">
            <div className="col-start-1 col-end-13">
              <Header />
            </div>
            <div className="col-start-3 col-end-11 flex flex-col gap-10">
              <StepContextProvider>
                <div className="grid grid-cols-12">
                  <div className="col-start-1 col-end-4">
                    <Steps />
                  </div>
                  <div className="col-start-5 col-end-12">{children}</div>
                </div>
              </StepContextProvider>
            </div>
          </div>
        </AntdRegistry>
      </body>
    </html>
  );
}
