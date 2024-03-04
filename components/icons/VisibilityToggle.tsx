// components/VisibilityToggle.js
import React from 'react';
import { EyeFilledIcon } from "@/components/icons/EyeFilledIcon"; // Assurez-vous que ces icônes sont correctement importées
import {EyeSlashFilledIcon} from "@/components/icons/EyeSlashFilledIcon"
const VisibilityToggle = ({ isVisible, toggleVisibility }) => (
    <button
        className="focus:outline-none"
        type="button"
        onClick={toggleVisibility}
    >
        {isVisible ? (
            <EyeSlashFilledIcon className="text-2xl text-default-400 pointer-events-none" />
        ) : (
            <EyeFilledIcon className="text-2xl text-default-400 pointer-events-none" />
        )}
    </button>
);

export default VisibilityToggle;
