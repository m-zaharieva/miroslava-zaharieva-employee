export default function agregateData(csvArray) {
        let projects = csvArray.map(row => row.ProjectID).filter((val, index, self) => self.indexOf(val) == index);

        let tandemsPerProject = {};

        projects.forEach(p => {
            let members = csvArray.filter(row => row.ProjectID == p);

            if (members.length <= 1) {
                return;
            } 

            for (let i = 0; i < members.length; i++) {
                let currentMember = {...members[i]};
                parseDates(currentMember)

                for (let j = i + 1; j < members.length; j++) {
                    let nextMember = {...members[j]};
                    parseDates(nextMember)
                    if (currentMember.DateFrom < nextMember.DateTo && currentMember.DateTo > nextMember.DateFrom) {
                        let start = Math.max(currentMember.DateFrom, nextMember.DateFrom);
                        console.log(start);
                        let end = Math.min(currentMember.DateTo, nextMember.DateTo);
                        let days = Math.floor((end - start) / (1000 * 60 * 60 * 24));
                        console.log(days);

                        if (!tandemsPerProject.hasOwnProperty('tandem')) {
                            tandemsPerProject.tandem = [currentMember.EmpID, nextMember.EmpID];
                            tandemsPerProject.projectId = p;
                            tandemsPerProject.days = days;
                        }
                        if (days > tandemsPerProject.days) {
                            if (tandemsPerProject.tandem.includes(currentMember.EmpID) && tandemsPerProject.tandem.includes(nextMember.EmpID)) {
                                tandemsPerProject.days += days;
                            } else {
                                tandemsPerProject.tandem = [currentMember.EmpID, nextMember.EmpID];
                                tandemsPerProject.projectId = p;
                                tandemsPerProject.days = days;
                            }
                        }
                    }
                }
            }
        })
        return tandemsPerProject;
    }


    function parseDates(member) {
        if (typeof member.DateFrom == 'string') {
            let parseDateFrom = Date.parse(member.DateFrom);
            member.DateFrom = parseDateFrom;
        }
        if (typeof member.DateTo == 'string' && member.DateTo !== "NULL") {
            let parseDateTo = Date.parse(member.DateTo);
            member.DateTo = parseDateTo;
        }
        if (member.DateTo == "NULL") {
            let parsedDateTo = Date.now();
            member.DateTo = parsedDateTo;
        }
    }


