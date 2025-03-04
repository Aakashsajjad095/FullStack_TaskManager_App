import * as React from "react";
import Svg, { Path, G } from "react-native-svg";

export default function Logo(props) {
  return (
    <Svg
      width={20}
      height={20}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <G>
        {/* Simplified Clipboard base */}
        <Path 
          d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" 
        />
        {/* Clipboard top */}
        <Path 
          d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1z" 
        />
        {/* Checkmark */}
        <Path 
          d="M9 12l2 2 4-4" 
        />
      </G>
    </Svg>
  );
} 