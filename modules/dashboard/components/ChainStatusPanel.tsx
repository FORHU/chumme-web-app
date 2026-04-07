"use client";

import { Play, SkipForward, RefreshCw } from "lucide-react";

import type { ChainStatus } from "@/modules/platform-ingestion/api/ingestion-api";

const PLATFORM_COLORS: Record<
  string,
  { bg: string; border: string; text: string; dot: string }
> = {
  YOUTUBE: {
    bg: "rgba(226,75,74,0.12)",
    border: "#E24B4A",
    text: "#E24B4A",
    dot: "#E24B4A",
  },
  INSTAGRAM: {
    bg: "rgba(212,83,126,0.12)",
    border: "#D4537E",
    text: "#D4537E",
    dot: "#D4537E",
  },
  TIKTOK: {
    bg: "rgba(136,135,128,0.12)",
    border: "#888780",
    text: "#B4B2A9",
    dot: "#888780",
  },
  FACEBOOK: {
    bg: "rgba(55,138,221,0.12)",
    border: "#378ADD",
    text: "#378ADD",
    dot: "#378ADD",
  },
};

const DEFAULT_COLOR = {
  bg: "rgba(136,135,128,0.1)",
  border: "#5F5E5A",
  text: "#888780",
  dot: "#888780",
};

interface Props {
  data: ChainStatus | undefined;
  isLoading: boolean;
  isDarkMode: boolean;
  isStarting: boolean;
  isSkipping: boolean;
  onStart: () => void;
  onSkip: () => void;
  onRefresh: () => void;
}

export function ChainStatusPanel({
  data,
  isLoading,
  isDarkMode,
  isStarting,
  isSkipping,
  onStart,
  onSkip,
  onRefresh,
}: Props) {
  const surfaceBg = isDarkMode ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.03)";
  const border = isDarkMode ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.08)";
  const textPrimary = isDarkMode ? "#ffffff" : "#111111";
  const textSecondary = isDarkMode ? "#888780" : "#5F5E5A";
  const btnBg = isDarkMode ? "rgba(255,255,255,0.06)" : "rgba(0,0,0,0.05)";

  const currentColor =
    PLATFORM_COLORS[data?.currentStep ?? ""] ?? DEFAULT_COLOR;
  const nextColor = PLATFORM_COLORS[data?.nextStep ?? ""] ?? DEFAULT_COLOR;

  return (
    <div
      style={{
        background: isDarkMode ? "rgba(255,255,255,0.03)" : "#ffffff",
        border:
          data?.isActive && data?.currentStep
            ? `1px solid ${currentColor.border}33`
            : `0.5px solid ${border}`,
        borderRadius: 16,
        padding: "1.25rem",
        marginBottom: "1.5rem",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: "1.25rem",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 15, fontWeight: 500, color: textPrimary }}>
            Crawl chain
          </span>
          {!isLoading && data && (
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 5,
                fontSize: 11,
                fontWeight: 500,
                padding: "3px 10px",
                borderRadius: 20,
                background: data.isActive ? "rgba(29,158,117,0.15)" : surfaceBg,
                color: data.isActive ? "#1D9E75" : textSecondary,
              }}
            >
              <span
                style={{
                  width: 6,
                  height: 6,
                  borderRadius: "50%",
                  background: data.isActive ? "#1D9E75" : textSecondary,
                  display: "inline-block",
                }}
              />
              {data.isActive ? "Active" : "Idle"}
            </span>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <button
            onClick={onRefresh}
            style={{
              width: 32,
              height: 32,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: btnBg,
              border: `0.5px solid ${border}`,
              borderRadius: 8,
              cursor: "pointer",
              color: textSecondary,
            }}
          >
            <RefreshCw size={14} />
          </button>

          <button
            onClick={onSkip}
            disabled={isSkipping || !data?.isActive}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              padding: "7px 14px",
              borderRadius: 8,
              cursor: isSkipping || !data?.isActive ? "not-allowed" : "pointer",
              opacity: isSkipping || !data?.isActive ? 0.4 : 1,
              background: btnBg,
              border: `0.5px solid ${border}`,
              color: textPrimary,
            }}
          >
            {isSkipping ? (
              <span
                style={{
                  width: 12,
                  height: 12,
                  border: "2px solid currentColor",
                  borderTopColor: "transparent",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            ) : (
              <SkipForward size={13} />
            )}
            {isSkipping ? "Skipping…" : "Skip step"}
          </button>

          <button
            onClick={onStart}
            disabled={isStarting || data?.isActive}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 13,
              fontWeight: 500,
              padding: "7px 14px",
              borderRadius: 8,
              cursor: isStarting || data?.isActive ? "not-allowed" : "pointer",
              opacity: isStarting || data?.isActive ? 0.4 : 1,
              background: "linear-gradient(135deg,#A53860,#670D2F)",
              border: "none",
              color: "#ffffff",
            }}
          >
            {isStarting ? (
              <span
                style={{
                  width: 12,
                  height: 12,
                  border: "2px solid rgba(255,255,255,0.3)",
                  borderTopColor: "#fff",
                  borderRadius: "50%",
                  display: "inline-block",
                  animation: "spin 0.7s linear infinite",
                }}
              />
            ) : (
              <Play size={13} />
            )}
            {isStarting ? "Starting…" : "Start chain"}
          </button>
        </div>
      </div>

      {isLoading && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            gap: 10,
          }}
        >
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              style={{
                height: 72,
                borderRadius: 10,
                background: surfaceBg,
                animation: "pulse 1.5s ease-in-out infinite",
              }}
            />
          ))}
        </div>
      )}

      {!isLoading && data && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 10,
              marginBottom: "1rem",
            }}
          >
            <div
              style={{
                background: surfaceBg,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  margin: "0 0 8px",
                }}
              >
                Current step
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: currentColor.dot,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 600,
                    color: currentColor.text,
                  }}
                >
                  {data.currentStep || "None"}
                </span>
              </div>
            </div>

            <div
              style={{
                background: surfaceBg,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  margin: "0 0 6px",
                }}
              >
                Pending jobs
              </p>
              <p
                style={{
                  fontSize: 26,
                  fontWeight: 600,
                  margin: 0,
                  color: data.pendingJobs > 0 ? "#D4537E" : textPrimary,
                }}
              >
                {data.pendingJobs.toLocaleString()}
              </p>
            </div>

            <div
              style={{
                background: surfaceBg,
                borderRadius: 10,
                padding: "12px 14px",
              }}
            >
              <p
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  margin: "0 0 8px",
                }}
              >
                Next step
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    width: 8,
                    height: 8,
                    borderRadius: "50%",
                    background: nextColor.dot,
                    opacity: 0.5,
                    flexShrink: 0,
                  }}
                />
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: textSecondary,
                  }}
                >
                  {data.nextStep || "None"}
                </span>
              </div>
            </div>
          </div>

          <div
            style={{ borderTop: `0.5px solid ${border}`, margin: "0.75rem 0" }}
          />

          {data.chain.length > 0 && (
            <>
              <p
                style={{
                  fontSize: 11,
                  color: textSecondary,
                  margin: "0 0 10px",
                }}
              >
                Chain order
              </p>
              <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                {data.chain.map((platform, index) => {
                  const isCurrent = platform === data.currentStep;
                  const currentIndex = data.chain.indexOf(data.currentStep);
                  const isDone = currentIndex > index;
                  const color = PLATFORM_COLORS[platform] ?? DEFAULT_COLOR;

                  return (
                    <div
                      key={platform}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        flex: 1,
                        minWidth: 0,
                      }}
                    >
                      <div
                        style={{
                          flex: 1,
                          minWidth: "80px",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          gap: 5,
                          padding: "10px 8px",
                          borderRadius: 10,
                          background: isCurrent
                            ? color.bg
                            : isDone
                              ? "rgba(29,158,117,0.1)"
                              : surfaceBg,
                          border: isCurrent
                            ? `1.5px solid ${color.border}`
                            : `0.5px solid ${border}`,
                        }}
                      >
                        <span
                          style={{
                            width: 7,
                            height: 7,
                            borderRadius: "50%",
                            background: isCurrent
                              ? color.dot
                              : isDone
                                ? "#1D9E75"
                                : border,
                          }}
                        />
                        <span
                          style={{
                            fontSize: 11,
                            fontWeight: 500,
                            color: isCurrent
                              ? color.text
                              : isDone
                                ? "#1D9E75"
                                : textSecondary,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {platform}
                        </span>
                        {isCurrent && (
                          <span
                            style={{
                              fontSize: 10,
                              color: color.text,
                              opacity: 0.7,
                            }}
                          >
                            ← now
                          </span>
                        )}
                        {isDone && (
                          <span
                            style={{
                              fontSize: 10,
                              color: "#1D9E75",
                              opacity: 0.7,
                            }}
                          >
                            done
                          </span>
                        )}
                      </div>
                      {index < data.chain.length - 1 && (
                        <div
                          style={{
                            width: 16,
                            height: 1,
                            flexShrink: 0,
                            background: isDone
                              ? "rgba(29,158,117,0.4)"
                              : border,
                          }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}

          {!data.isActive && (
            <p style={{ fontSize: 12, color: textSecondary, marginTop: 12 }}>
              Chain is idle. Press &quot;Start chain&quot; to begin sequential
              crawling across all platforms.
            </p>
          )}
        </>
      )}

      {!isLoading && !data && (
        <p
          style={{
            fontSize: 13,
            textAlign: "center",
            padding: "1rem 0",
            color: textSecondary,
          }}
        >
          Could not load chain status.
        </p>
      )}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.55; } }
      `}</style>
    </div>
  );
}
