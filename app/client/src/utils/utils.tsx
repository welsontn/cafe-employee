const utils = {
	/**
	 * Compare date and return date diff in days.
	 * @param sdate start date
	 * @param ddate end date
	 * @returns days
	 */
	dateDiffInDays: (sdate: string, ddate: string): number => {

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

export default utils;