import { NdoweyeCalendar } from "@/components/ndoweye-calendar"

export default function Page() {
  return (
    <div className="relative min-h-screen">
      {/* Background gradient container */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,1)_0%,rgba(255,255,255,0.9)_25%,rgba(255,255,255,0.8)_50%)]" />
        <div className="absolute inset-0">
          <div className="absolute inset-0 animate-slow-spin">
            <div className="absolute inset-[-100%] blur-[100px] opacity-50"
              style={{
                background: `
                  linear-gradient(
                    45deg,
                    rgba(97, 183, 237, 0.5) -10%,   /* Light blue */
                    rgba(155, 89, 182, 0.3) 20%,    /* Purple */
                    rgba(231, 76, 60, 0.3) 40%,     /* Red */
                    rgba(241, 196, 15, 0.3) 60%,    /* Yellow */
                    rgba(46, 204, 113, 0.3) 80%,    /* Green */
                    rgba(52, 152, 219, 0.5) 110%    /* Blue */
                  )
                `
              }}
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 custom:px-[5%] flex flex-col min-h-screen">
        <div className="flex-grow flex items-center justify-center">
          <NdoweyeCalendar />
        </div>
        <footer className="text-center py-4 text-sm text-gray-600">
          Elanjiminyya © 2024. Designed by the Explorimentalist.
        </footer>
      </div>
    </div>
  )
}