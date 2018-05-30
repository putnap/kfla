import * as React from "react";

export const LandscapeOrientation = () => (
    <style type="text/css">
        {"@media print{@page {size: A4 landscape} html {font-size: 53%}"}
    </style>
);

export const PortraitOrientation = () => (
    <style type="text/css">
        {"@media print{@page {size: auto}}"}
    </style>
);