import _ from "lodash";

export const getHashTags = (data) => {
	const getHashTagArrays = (
		_.map(data, (value) => {
			return value.entities.hashtags
		})
	)
	const filterEmptyHashTag = _.filter(getHashTagArrays, (value) => {
		if(!_.isEmpty(value)) {
			return value
		}
	})
	const hashTags = _.map(filterEmptyHashTag, (value) =>{
		return _.map(value, (value) => {
			return value.text
		});
	})
	const flatHashTags = [].concat(...hashTags);
	const uniqueHashTags = new Set(flatHashTags);
	return [...uniqueHashTags];
};
