import React, { useLayoutEffect, useRef } from "react";
import data from "@emoji-mart/data";
import { Picker } from "emoji-mart";
import "./css/emoji-mart.css";
import { useState } from "react";
import useDebounce from "../../../../hooks/useDebounce";
import { useDetectClickOutside } from "react-detect-click-outside";
import { ReactComponent as CloseSvg } from "../../../../../assets/media/heroicons/outline/x.svg";

export const EmojiArea = (props) => {
	const emojiBtnRef = useRef();
	const [innerWidth, setInnerWidth] = useState(window.innerWidth);
	const [emojiDropdown, setDropdown] = useState(false);
	const newInnerWidth = useDebounce(innerWidth, 500);
	const onClickEmoji = (emoji, e) => {
		props.setMessageText((prev) => {
			return { ...prev, message: prev.message + emoji.native };
		});
	};
	const dropdownEmojiRef = useDetectClickOutside({
		onTriggered: (e) => {
			// if (emojiDropdown) setDropdown(false)
		}
	});
	useLayoutEffect(() => {
		window.addEventListener("resize", () => setInnerWidth(window.innerWidth));
		setInnerWidth(window.innerWidth);
	}, []);
	return (
		<div className={`${props.isEditing ? 'types-button' : 'emoji-area-btn'} send-icon`} ref={emojiBtnRef}>
			<div className="dropdown position-relative">
				<button
					className="btn text-capitalize px-0"
					type="button"
					onClick={() => setDropdown(!emojiDropdown)}
				>
					<div className="emojionearea-button-open show">
						{!emojiDropdown ? <svg className="text-muted hw-20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
						</svg> : <CloseSvg color="#adb5be" />}
					</div>
				</button>
				{emojiDropdown && <ul className="dropdown-menu emoji-dropdown m-0 show" ref={dropdownEmojiRef} onBlur={() => setDropdown(false)}>
					<EmojiPicker
						style={{}}
						emojiSize={18}
						perLine={getPerLineEmoji(newInnerWidth)}
						onEmojiSelect={(emoji, e) => onClickEmoji(emoji, e)}
						showPreview={false}
						showSkinTones={false}
						emojiTooltip={false}
						theme={'dark'}
					/>
				</ul>}
			</div>
		</div>
	);
};

const getPerLineEmoji = (newInnerWidth) => {
	// if (newInnerWidth > 1300 && newInnerWidth > 1400) return 7;
	// if (newInnerWidth > 1399) return 12;
	// else if (newInnerWidth > 1199) return 10;
	// else if (newInnerWidth > 991) return 16;
	// else if (newInnerWidth > 767) return 14;
	// else if (newInnerWidth > 575) return 12;
	return 7;
}

export const EmojiPicker = (props) => {
	const ref = useRef();
	useLayoutEffect(() => {
		new Picker({
			...props,
			data,
			ref,
		});
		//eslint-disable-next-line
	}, [props.perLine]);

	return <div ref={ref} />;
};
