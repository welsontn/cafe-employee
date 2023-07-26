const utils = {
	generateRandomId: (length: number) => {
		var randoms = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
		var result = "";
		length = (length>40)?40:length;
		for (let i = 0; i < length;i++){
      		result += randoms.charAt(Math.floor(Math.random() * randoms.length));
		}
		return result;
	},
	dateDiff: (sdate: string, ddate: string): number => {
		const date1:Date = new Date(sdate);
		const date2:Date = new Date(ddate);
		const diffTime:number = Math.abs(date2.getTime() - date1.getTime());
		const diffDays:number = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
		// console.log(diffTime + " milliseconds");
		return diffDays;
	},
	errorCheck: (error:any): string => {
	    let msg: string = "Unknown error";
	    if (typeof error === "string") {
	      msg = error;
	    } else if (error instanceof Error) {
	      msg = error.message;
	    }
		return msg;
	}
};

export = utils;