export const getBackgroundStyle = (
    pattern: string,
    opacity: number,
    color: string = "#000"
): React.CSSProperties => {
    const base = {
        opacity,
        backgroundSize: "auto",
    };

    switch (pattern) {
        case "dots":
            return {
                ...base,
                backgroundImage: `radial-gradient(${color} 1px, transparent 1px)`,
                backgroundSize: "20px 20px",
            };

        case "grid":
            return {
                ...base,
                backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px),
          linear-gradient(90deg, ${color} 1px, transparent 1px)
        `,
                backgroundSize: "30px 30px",
            };

        case "diagonal-lines":
            return {
                ...base,
                backgroundImage: `repeating-linear-gradient(
          45deg,
          ${color},
          ${color} 2px,
          transparent 2px,
          transparent 12px
        )`,
            };

        case "chevron":
            return {
                ...base,
                backgroundImage: `
          linear-gradient(135deg, ${color} 25%, transparent 25%),
          linear-gradient(225deg, ${color} 25%, transparent 25%)
        `,
                backgroundSize: "40px 40px",
            };

        case "waves":
            return {
                ...base,
                backgroundImage: `repeating-radial-gradient(
          circle at 0 0,
          ${color},
          transparent 20px
        )`,
            };

        case "topographic":
            return {
                ...base,
                backgroundImage: `repeating-radial-gradient(
          circle,
          ${color} 0.5px,
          transparent 2px
        )`,
                backgroundSize: "40px 40px",
            };

        case "paper":
            return {
                ...base,
                backgroundColor: "#fdfcf8",
                backgroundImage: `
          linear-gradient(${color} 1px, transparent 1px)
        `,
                backgroundSize: "100% 28px",
            };

        case "glow":
            return {
                ...base,
                background: `radial-gradient(circle at 30% 30%, ${color}, transparent 60%)`,
            };

        case "arrows":
            return {
                ...base,
                backgroundImage: `repeating-linear-gradient(
          45deg,
          ${color} 0px,
          ${color} 2px,
          transparent 2px,
          transparent 16px
        )`,
            };

        case "round-arrows":
            return {
                ...base,
                backgroundImage: `radial-gradient(${color} 2px, transparent 2px)`,
                backgroundSize: "30px 30px",
            };

        default:
            return {};
    }
};