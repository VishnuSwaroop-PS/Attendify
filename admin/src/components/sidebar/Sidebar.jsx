import React from "react";
import logoImg from "../../assets/logo.png";

function Sidebar({ setRenderScreenVal }) {
  return (
    <div className="fixed flex w-16 h-screen bg-transparent z-40 font-Outfit">
      <div className="flex h-screen w-16 flex-col justify-between border-e bg-transparent backdrop-blur-sm">
        <div>
          <div className="inline-flex size-16 items-center justify-center">
            <span className="grid size-10 place-content-center rounded-lg bg-gray-100 text-xs text-gray-600">
              <img src={logoImg} alt="logo" />
            </span>
          </div>

          <div className="border-t border-gray-100">
            <div className="px-2">
              <ul className="space-y-1 border-t border-gray-100 pt-4">
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setRenderScreenVal(0);
                    }}
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-green-50 hover:text-primaryColor"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                      />
                    </svg>

                    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-primaryColor px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Classes
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setRenderScreenVal(1);
                    }}
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-green-50 hover:text-primaryColor"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                      />
                    </svg>

                    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-primaryColor px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Courses
                    </span>
                  </a>
                </li>

                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setRenderScreenVal(2);
                    }}
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-green-50 hover:text-primaryColor"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="size-5 opacity-75"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>

                    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-primaryColor px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Teachers
                    </span>
                  </a>
                </li>
                <li>
                  <a
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      setRenderScreenVal(3);
                    }}
                    className="group relative flex justify-center rounded px-2 py-1.5 text-gray-500 hover:bg-green-50 hover:text-primaryColor"
                  >
                   <svg
  xmlns="http://www.w3.org/2000/svg"
  className="size-5 opacity-75"
  fill="none"
  viewBox="0 0 24 24"
  stroke="currentColor"
  strokeWidth="1"
>
  <path
    fill-rule="evenodd"
    clip-rule="evenodd"
    d="M5 8a1 1 0 0 1-2 0V5.923c0-.76.082-1.185.319-1.627.223-.419.558-.754.977-.977C4.738 3.082 5.162 3 5.923 3H8a1 1 0 0 1 0 2H5.923c-.459 0-.57.022-.684.082a.364.364 0 0 0-.157.157c-.06.113-.082.225-.082.684V8zm3 11a1 1 0 1 1 0 2H5.923c-.76 0-1.185-.082-1.627-.319a2.363 2.363 0 0 1-.977-.977C3.082 19.262 3 18.838 3 18.077V16a1 1 0 1 1 2 0v2.077c0 .459.022.57.082.684.038.07.087.12.157.157.113.06.225.082.684.082H8zm7-15a1 1 0 0 0 1 1h2.077c.459 0 .57.022.684.082.07.038.12.087.157.157.06.113.082.225.082.684V8a1 1 0 1 0 2 0V5.923c0-.76-.082-1.185-.319-1.627a2.363 2.363 0 0 0-.977-.977C19.262 3.082 18.838 3 18.077 3H16a1 1 0 0 0-1 1zm4 12a1 1 0 1 1 2 0v2.077c0 .76-.082 1.185-.319 1.627a2.364 2.364 0 0 1-.977.977c-.442.237-.866.319-1.627.319H16a1 1 0 1 1 0-2h2.077c.459 0 .57-.022.684-.082a.363.363 0 0 0 .157-.157c.06-.113.082-.225.082-.684V16zM3 11a1 1 0 1 0 0 2h18a1 1 0 1 0 0-2H3z"
  />
</svg>

                    <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-primaryColor px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                      Scaning
                    </span>
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="sticky inset-x-0 bottom-0 border-t border-gray-100 bg-white p-2">
          <form action="#">
            <button
              type="submit"
              className="group relative flex w-full justify-center rounded-lg px-2 py-1.5 text-sm text-gray-500 hover:bg-green-50 hover:text-primaryColor"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="size-5 opacity-75"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>

              <span className="invisible absolute start-full top-1/2 ms-4 -translate-y-1/2 rounded bg-primaryColor px-2 py-1.5 text-xs font-medium text-white group-hover:visible">
                Logout
              </span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;