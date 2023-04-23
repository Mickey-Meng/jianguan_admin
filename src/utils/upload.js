/**
 * 校验可上传的文件格式
 * @param {*} file 
 * @param {*} allowFileTypes 
 */
export function checkFileType(file, allowFileTypes){
    if (allowFileTypes) {
        let fileExtension = "";
        if (file.name.lastIndexOf(".") > -1) {
          fileExtension = file.name.slice(file.name.lastIndexOf(".") + 1);
        }
        const isTypeOk = allowFileTypes.some((type) => {
          if (file.type.indexOf(type) > -1) return true;
          if (fileExtension && fileExtension.indexOf(type) > -1) return true;
          return false;
        });
        if (!isTypeOk) {
          $modal.msgError(`文件格式不正确, 请上传${allowFileTypes.join("/")}格式文件!`);
          return false;
        }
    }
    return true;
}

/**
 * 校验最大上传的文件大小
 * @param {*} file 
 * @param {*} allowMaxFileSize 
 */
export function checkFileSize(file, allowMaxFileSize){
    if (allowMaxFileSize) {
        const isLt = file.size / 1024 / 1024 < allowMaxFileSize;
        if (!isLt) {
          $modal.msgError(`上传文件大小不能超过 ${allowMaxFileSize} MB!`);
          return false;
        }
      }
    return true;
}


/**
 * 获取文件名称
 * @param {*} name 
 * @returns 
 */
export function getFileName(name) {
    // 如果是url那么取最后的名字 如果不是直接返回
    if (name.lastIndexOf("/") > -1) {
      return name.slice(name.lastIndexOf("/") + 1);
    } else {
      return name;
    }
  }

/**
 * 对象转成指定字符串分隔
 * @param {*} list 
 * @param {*} separator 
 * @returns 
 */
  export function listOssIdToString(list, separator) {
    let strs = "";
    separator = separator || ",";
    for (let i in list) {
      strs += list[i].ossId + separator;
    }
    return strs != "" ? strs.substr(0, strs.length - 1) : "";
  }