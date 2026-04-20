import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const revalidate = false;

// Twitter summary_large_image: 1200×600 (2:1 ratio)
export const alt = "Plutolio – Personal Finance Tracker";
export const size = { width: 1200, height: 600 };
export const contentType = "image/png";

const GREEN = "#34d399";
const GREEN_DARK = "#10b981";

export default function TwitterImage() {
    return new ImageResponse(
        <div
            style={{
                width: "1200px",
                height: "600px",
                display: "flex",
                backgroundColor: "#0a0a0a",
                fontFamily: "ui-sans-serif, system-ui, sans-serif",
                position: "relative",
                overflow: "hidden",
            }}
        >
            {/* Grid */}
            <div
                style={{
                    position: "absolute",
                    inset: "0",
                    display: "flex",
                    backgroundImage:
                        "linear-gradient(rgba(52,211,153,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(52,211,153,0.06) 1px, transparent 1px)",
                    backgroundSize: "44px 44px",
                }}
            />
            {/* Glow */}
            <div
                style={{
                    position: "absolute",
                    top: "-180px",
                    left: "100px",
                    width: "800px",
                    height: "480px",
                    borderRadius: "50%",
                    display: "flex",
                    background:
                        "radial-gradient(ellipse at center, rgba(52,211,153,0.20) 0%, transparent 70%)",
                }}
            />

            {/* Left column — text */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    padding: "0 68px",
                    width: "680px",
                    gap: "24px",
                }}
            >
                {/* Logo */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                    }}
                >
                    <div
                        style={{
                            width: "44px",
                            height: "44px",
                            borderRadius: "12px",
                            background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 0 20px rgba(52,211,153,0.4)",
                        }}
                    >
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                        >
                            <rect
                                x="3"
                                y="12"
                                width="4"
                                height="9"
                                rx="1"
                                fill="white"
                            />
                            <rect
                                x="10"
                                y="7"
                                width="4"
                                height="14"
                                rx="1"
                                fill="white"
                            />
                            <rect
                                x="17"
                                y="3"
                                width="4"
                                height="18"
                                rx="1"
                                fill="white"
                            />
                        </svg>
                    </div>
                    <span
                        style={{
                            fontSize: "26px",
                            fontWeight: "800",
                            color: "#fff",
                            letterSpacing: "-0.5px",
                        }}
                    >
                        Plutolio
                    </span>
                </div>

                {/* Headline */}
                <div
                    style={{
                        display: "flex",
                        flexDirection: "column",
                        gap: "4px",
                    }}
                >
                    <div
                        style={{
                            fontSize: "52px",
                            fontWeight: "900",
                            color: "#ffffff",
                            lineHeight: "1.05",
                            letterSpacing: "-1.5px",
                        }}
                    >
                        Financial Chaos
                        <br />
                        <span style={{ color: GREEN }}>→ Perfect Clarity</span>
                    </div>
                </div>

                <div
                    style={{
                        fontSize: "20px",
                        color: "rgba(255,255,255,0.50)",
                        lineHeight: "1.5",
                        maxWidth: "540px",
                    }}
                >
                    Track accounts, budgets & receipts in one secure app.
                </div>

                {/* CTA */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        alignSelf: "flex-start",
                        background: `linear-gradient(135deg, ${GREEN} 0%, ${GREEN_DARK} 100%)`,
                        borderRadius: "10px",
                        padding: "12px 26px",
                        boxShadow: "0 0 22px rgba(52,211,153,0.35)",
                    }}
                >
                    <span
                        style={{
                            fontSize: "16px",
                            fontWeight: "800",
                            color: "#052e16",
                        }}
                    >
                        Start Tracking Free →
                    </span>
                </div>
            </div>

            {/* Right column — stat cards */}
            <div
                style={{
                    position: "relative",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    gap: "14px",
                    flex: 1,
                    padding: "0 60px 0 0",
                }}
            >
                {[
                    {
                        label: "Total Balance",
                        value: "$16,240.50",
                        sub: "+$450 this month",
                        up: true,
                    },
                    {
                        label: "Monthly Spent",
                        value: "$1,842.40",
                        sub: "72% of budget",
                        up: false,
                    },
                    {
                        label: "Active Budgets",
                        value: "5 categories",
                        sub: "All on track",
                        up: true,
                    },
                ].map((card) => (
                    <div
                        key={card.label}
                        style={{
                            display: "flex",
                            flexDirection: "column",
                            gap: "6px",
                            background: "rgba(255,255,255,0.04)",
                            border: "1px solid rgba(255,255,255,0.08)",
                            borderRadius: "14px",
                            padding: "18px 22px",
                        }}
                    >
                        <span
                            style={{
                                fontSize: "13px",
                                color: "rgba(255,255,255,0.45)",
                                fontWeight: "600",
                                textTransform: "uppercase",
                                letterSpacing: "0.5px",
                            }}
                        >
                            {card.label}
                        </span>
                        <span
                            style={{
                                fontSize: "26px",
                                fontWeight: "800",
                                color: "#ffffff",
                                letterSpacing: "-0.5px",
                            }}
                        >
                            {card.value}
                        </span>
                        <span
                            style={{
                                fontSize: "13px",
                                color: card.up ? GREEN : "#f87171",
                                fontWeight: "600",
                            }}
                        >
                            {card.sub}
                        </span>
                    </div>
                ))}
            </div>
        </div>,
        { ...size },
    );
}
