import React from 'react'
import * as momentTimzone from 'moment-timezone';
import { ReactComponent as EditSvg } from "../../../../assets/media/heroicons/solid/pencil.svg";
import { ReactComponent as DeleteSvg } from "../../../../assets/media/heroicons/solid/trash.svg";

export const ListIssueItem = ({ issue, setReqData }) => {
    const OnClickEditRequest = (e) => {
        e?.stopPropagation();
    }
    const deleteRequest = (e) => {
        e?.stopPropagation();

    }
    return (
        <tr className="list-task-table-row cursor-pointer" onClick={() => setReqData(issue)}>
            <td className='text-truncate'>
                <nobr>{issue?.subject}</nobr>
            </td>
            <td className="">
                <nobr>{`#${issue.id}`}</nobr>
            </td>
            <td className="text-center">
                <nobr>
                    {momentTimzone(issue.createdAt).format("MM/DD/YY")}
                </nobr>
            </td>
            <td className="text-center">
                <nobr>
                    {/* {momentTimzone(issue.updatedAt).fromNow()} */}
                    {momentTimzone(issue.updatedAt).format("MM/DD/YY")}
                </nobr>
            </td>
            <td className="text-center">
                <nobr className='text-capitalize'>
                    {issue?.status}
                </nobr>
            </td>
            <td className="text-center" onClick={e => e?.stopPropagation()}>
                <nobr className="d-flex more_items justify-content-center">
                    <div className="item p-4_8 mx-1 cursor-pointer" onClick={OnClickEditRequest}>
                        <EditSvg color='#665dfe' />
                    </div>
                    <div className="item p-4_8 text-danger mx-1 cursor-pointer" onClick={deleteRequest}>
                        <DeleteSvg />
                    </div>
                </nobr>
            </td>
        </tr>
    )
}
