
class WorkerInterface {
    constructor(map, objList, postFn) {
        this.map = map;
        this.objList = objList;
        this.postFn = postFn;
        this.completedJobs = new Map();
    }

    getInitJson() {
        return {
            mapBoundingBox: this.map.getBoundingBox().serialize(),
            staticBboxes: this.objList.map(ob => ob.getBoundingBox().serialize()),
        };
    }

    /**
     * @param {object} job 
     * @param {string} job.id
     * @param {{ x: number; y: number; }} job.currentPosition
     * @param {{ x: number; y: number; }} job.goalPosition
     */
    addJob(job) {
        this.postFn(job);
    }

    /**
     * 
     * @param {*} completedJob 
     * @param {*} completedJob.id
     * @param {*} completedJob.details
     */
    receiveCompletedJobDetails(completedJob) {
        this.completedJobs.set(completedJob.id, completedJob.details);
    }

    jobComplete(id) {
        return this.completedJobs.has(id);
    }

    popCompletedJob(id) {
        const details = this.completedJobs.get(id);
        this.completedJobs.delete(id);
        return details;
    }
}

class WorkProcessor {
    constructor(initJson, postFn) {
        this.jobs = [];
        this.postFn = postFn;
        this.staticObjects = initJson.staticBboxes.map(b => {
            const bbox = Bbox.deserialize(b);
            return { getBoundingBox() { return bbox; } };
        });
        this.mapBoundingBox = Bbox.deserialize(initJson.mapBoundingBox);
    }

    /**
     * @param {object} job 
     * @param {string} job.id
     * @param {{ x: number; y: number; }} job.currentPosition
     * @param {{ x: number; y: number; }} job.goalPosition
     */
    beginJob(job) {
        const augmentedJob = {
            ...job,
            process: constructPlan(
                job.goalPosition,
                job.currentPosition,
                this.staticObjects,
                this.mapBoundingBox,
            ),
        };
        this.jobs.push(augmentedJob);   
    }

    step() {
        this.jobs = this.jobs.filter(job => {
            const result = job.process.next();
            if (result.done) {
                this.postFn({
                    id: job.id,
                    details: result.value,
                });
                return false;
            }
            return true;
        });
    }
}