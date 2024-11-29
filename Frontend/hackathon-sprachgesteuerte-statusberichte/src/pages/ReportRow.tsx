import React from 'react'
import { Link } from 'react-router-dom';

type ReportData = {
    id: number,
    title: string;
    date_created: string;
    construction_site: string;
    work_done_description?: string;
    material_used_description?: string;
    problems_emerged_description?: string;
    further_notes_description?: string;
};

export default function ReportRow({ id, title, construction_site }: ReportData) {
    return (
        <div className="grid grid-cols-3 font-regular text-md">
            <div>{title}</div>
            <div>{construction_site}</div>
            <div className="flex justify-end items-center ">
                <button
                    className="flex justify-between font-semibold text-sm gap-2 items-center hover:bg-[#F4F8FB] rounded-md py-1 px-3">
                    <Link to={`/report/${id}`}>Details anzeigen</Link>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="12"
                        height="12"
                        fill="#121212"
                        viewBox="0 0 256 256"
                        aria-hidden="true"
                        focusable="false">
                        <path d="M184.49,136.49l-80,80a12,12,0,0,1-17-17L159,128,87.51,56.49a12,12,0,1,1,17-17l80,80A12,12,0,0,1,184.49,136.49Z"></path>
                    </svg>
                </button>
            </div>
        </div>
    )
}
