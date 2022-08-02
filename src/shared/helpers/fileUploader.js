const http = require('./http')

module.exports = {
    upload: function(file, uploadDir = '') {
        if( !uploadDir ) {
            return {
                status: false,
                fileName: '',
                filePath: '',
                error: 'Upload directory not provided'
            }
        }
        else {
            try {
                let fileExtension = file.name.split('.').pop()
                let uniqueFileName = Date.now() + '-' + Math.round(Math.random() * 1E9) + '.' + fileExtension
                let uploadPath = uploadDir + uniqueFileName
    
                // Use the mv() method to place the file somewhere on your server
                file.mv(uploadPath)
                
                return {
                    status: true,
                    fileName: uniqueFileName,
                    filePath: uploadPath,
                    error: ''
                }
            } catch (err) {
                http.handleError({err})
    
                return {
                    status: false,
                    fileName: '',
                    filePath: '',
                    error: e.message
                }
            }
        }
    }
}
