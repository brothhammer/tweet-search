import React 							from 'react'
import PropTypes 					from 'prop-types'
import {
	ListItem,
	ListItemAvatar,
	Avatar,
	ListItemText } 					from "@material-ui/core";
import HashTag 						from "./HashTag";

const Tweet = ({ result, index, onClick }) => {
	return (
		<>
		<ListItem alignItems="flex-start"
							style ={ index % 2? { background : "#fafafa" }:{ background : "white" }}>
			<ListItemAvatar>
				<Avatar alt="Pic" src={result.user.profile_image_url_https} />
			</ListItemAvatar>
			<ListItemText
				primary={'@'.concat(result.user.screen_name)}
				secondary={
					<React.Fragment>
						{result.text}
						<br/>
						{result.entities.hashtags.map((hashTag, key) => (
							<span key={key}>
              <HashTag hashTag={hashTag.text} onClick={() => onClick(hashTag.text)} />
            </span>
						))}
					</React.Fragment>
				}
			/>
			</ListItem>
		</>
	)
}

Tweet.propTypes = {
	result: PropTypes.shape({
		text: PropTypes.string,
		user: PropTypes.shape({
			name: PropTypes.string,
			profile_image_url_https: PropTypes.string,
		}),
		entities: PropTypes.oneOfType([
			PropTypes.object,
			PropTypes.arrayOf(
				PropTypes.shape({
					hashtags: PropTypes.shape({
						text: PropTypes.string,
					}),
				})
			),
		]),
		index: PropTypes.number,
		onClick: PropTypes.func,
	}),
}

export default Tweet
