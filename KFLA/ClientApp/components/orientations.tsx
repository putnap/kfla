import * as React from "react";

export const LandscapeOrientation = () => (
    <style type="text/css">
        {"@media print{@page {size: A4 landscape} html {font-size: 50%; zoom: 90%}"}
    </style>
);

export const PortraitOrientation = () => (
    <style type="text/css">
        {"@media print{@page {size: auto}}"}
    </style>
);