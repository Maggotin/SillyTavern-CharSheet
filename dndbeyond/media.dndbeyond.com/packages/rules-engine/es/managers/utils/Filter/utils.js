/**
 *
 * @param input
 * @param startIdx
 * @param pieceIdx
 * @param pieceCharIdx
 * @param pieces
 */
export function checkQueryPiece(input, startIdx, pieceIdx, pieceCharIdx, pieces) {
    let i;
    let ch;
    let length = input.length;
    for (i = startIdx; i < length; i++) {
        ch = input.charAt(i);
        switch (ch) {
            case ' ':
            case '-':
            case '.':
            case '"':
                continue; //ignore spaces, dashes, periods, and double quotes
            default:
                if (pieceIdx < pieces.length) {
                    let piece = pieces[pieceIdx];
                    if (pieceCharIdx < piece.length && ch === piece.charAt(pieceCharIdx)) {
                        //if current character matches, check next character in piece
                        if (checkQueryPiece(input, i + 1, pieceIdx, pieceCharIdx + 1, pieces)) {
                            return true;
                        }
                        //if path for next character doesn't match, try path from start of next piece
                        if (checkQueryPiece(input, i + 1, pieceIdx + 1, 0, pieces)) {
                            return true;
                        }
                    }
                    if (pieceCharIdx === 0) {
                        //if first character of piece doesn't match, allow skipping that piece
                        if (checkQueryPiece(input, i, pieceIdx + 1, 0, pieces)) {
                            return true;
                        }
                    }
                }
                return false; //no match if no path above reaches end of input string
        }
    }
    return true; //match if reached end of input string
}
/**
 *
 * @param query
 * @param primaryText
 * @param tags
 */
export function doesQueryMatchData(query, primaryText, tags = []) {
    let input = query.toLowerCase().trim();
    if (!input) {
        // if there is no query don't filter anything
        return true;
    }
    let processedPrimaryText = primaryText ? primaryText.replace(/["+]/g, '').toLowerCase().trim() : '';
    let processedTags = tags && tags.length ? tags.map((tag) => (tag ? tag.toLowerCase().trim() : tag)) : [];
    let pieces = processedPrimaryText.split(/[ -]/);
    if (checkQueryPiece(input, 0, 0, 0, pieces)) {
        //don't filter out item if heading matches
        return true;
    }
    // if heading isn't a match, see if input is an exact match for associated tags
    if (!processedTags.length) {
        // filter out item if no tags specified
        return false;
    }
    let tagMatch = false;
    processedTags.forEach((tag) => {
        if (tagMatch || !tag) {
            return;
        }
        let pieces = tag.split(/[ -]/);
        tagMatch = checkQueryPiece(input, 0, 0, 0, pieces);
    });
    return tagMatch;
}
