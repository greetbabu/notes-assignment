var fs = require('fs');
const FILE_DIR = 'docs';
const INVALID_DATE = 'invalid-date';

// Get a note
var getANote = function(req, res) {
    if(req.query.date) {
        // console.log(`isValidDateFormat: ${isValidDateFormat(req.query.date)}`);
        req.query.date = getFormattedDate(req.query.date);
        if(req.query.date === INVALID_DATE) {
            return res.status(400).send({
                userAlert : `Invalid date format, expected format is 'yyyy-m-d' and year should be present year`
            })
        }
    }
    fs.readFile(`${FILE_DIR}/${deriveAndReturnFileName(req)}.txt`, { encoding: 'utf8' }, (err, result) => {
        if(err) {
            if(err.code === 'ENOENT') {
                err.userAlert = 'File not found'
                res.status(422);
            }
            res.send(err);
        } else {
            res.send(result);
        }
    })
};

var createANote = function(req, res) {
    if(req.query.date) {
        // console.log(`isValidDateFormat: ${isValidDateFormat(req.query.date)}`);
        req.query.date = getFormattedDate(req.query.date);
        if(req.query.date === INVALID_DATE) {
            return res.status(400).send({
                userAlert : `Invalid date format, expected format is 'yyyy-m-d' and year should be present year`
            })
        }
    }
    fs.writeFileSync(`${FILE_DIR}/${deriveAndReturnFileName(req)}.txt`, req.body, 'utf8');
    res.send('File has been saved');
};

var deriveAndReturnFileName = (req) => {
    // File name format is "userid-yyyy-m-d"
    return req.params.userId + (req.query.date ? '-'+req.query.date : '');
}

var getFormattedDate = (date) => {
    if((date.split('-')[0] > 999 && date.split('-')[0] <= new Date().getFullYear())
    && (date.split('-')[1] > 0 && date.split('-')[1] <= 12)
    && (date.split('-')[2] > 0 && date.split('-')[2] <= 31)) {
        return Number(date.split('-')[0]) 
            +'-' + date.split('-')[1]
            +'-' + date.split('-')[2];
    } else {
        return INVALID_DATE;
    }
    
}

module.exports = {
    getANote,
    createANote
};