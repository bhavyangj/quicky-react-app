import classes from "./TaskDetails.module.css";
import moment from 'moment-timezone';
import { DEFAULT_IMAGE } from "../../Layout/HomePage/HomePage";

export const TaskCommentDetail = ({ comment, isTemplate = false }) => {

    return (<>
        <div className={`${classes["comment-media"]} card m-1 d-flex flex-row border-0 mt-2`} key={comment.id}>
            <div className={`${classes.member} mr-2`}>
                <img src={comment.user?.profilePicture ? comment.user.profilePicture : DEFAULT_IMAGE} alt="people" />
            </div>
            <div className={`w-100`}>
                <div className="d-flex">
                    <h6 className="text-capitalize mb-0 mr-2 fs-12">
                        {comment?.user?.name}
                    </h6>
                    <small>
                        {moment(comment?.createdAt).format("MM/DD/YY hh:mm A")}
                    </small>
                </div>
                <div className={`${classes["comment-box"]} card text-muted`}>
                    {comment?.text}
                </div>
            </div>
        </div>
    </>)
}
