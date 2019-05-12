
class RandomUtility {
    /**
     * @desc returns a random number between a and b
     * @note a is assumed to be less than b
     * @param {number} a
     * @param {number} b 
     * @returns {number}
     */
    static randomIntBetween(a, b) {
        return Math.floor(Math.random() * (b - a) + a);
    }
}

/**
 * @desc returns a random position on the map
 * @param {Bbox} map 
 * @param {Array<{ getBoundingBox(): Bbox }>} staticObjects 
 * @param {number} maxIterations - the maximum number of times to loop through trying to randomly
 * generate a position
 * @returns {{ x: number, y: number} | undefined}
 */
function getRandomPlaceOnMap(map, staticObjects, maxIterations = 100) {
    const getRandomPosition = () => ({
        x: RandomUtility.randomIntBetween(map.x, map.x + map.w),
        y: RandomUtility.randomIntBetween(map.x, map.x + map.h),
    });
    for (let i = 0; i < maxIterations; i++) {
        const position = getRandomPosition();
        const pBox = new Bbox(position.x - 15, position.y - 15, 30, 30);
        if (!pBox.within(map)) continue;
        if (!pBox.intersectsWithAnyObject(staticObjects)) return position;
    }
    return undefined;
}
/*
    type PlanDetail = {
        moveToX: number;
        moveToY: number;
        facingAngle: number;
        animateWalk: boolean;
        prevState: PlanDetail | undefined;
    };
*/

class NavigatingPerson {
    constructor(person, map, objList) {
        this.person = person;
        this.map = map;
        this.objList = objList;
        this.plan = { type: 'none' };
        this._t = 0;
    }

    getSurroundingPositions(x, y, stepSize) {
        return [
            { x: x + stepSize, y: y + 0, angle: 0 },
            { x: x + stepSize, y: y + stepSize, angle: 45 },
            { x: x + 0, y: y + stepSize, angle: 90 },
            { x: x - stepSize, y: y + stepSize, angle: 135 },
            { x: x - stepSize, y: y + 0, angle: 180 },
            { x: x - stepSize, y: y - stepSize, angle: 225 },
            { x, y: y - stepSize, angle: 270 },
            { x: x + stepSize, y: y - stepSize, angle: 315 },
        ];
    }

    startPlanTo(goal) {
        this.plan = {
            type: 'partial',
            gen: this.constructPlan(goal, 400),
            count: 0,
        };
    }

    step(dt) {
        const plan = this.plan;
        // console.log(plan.type, this.objList.length);
        if (plan.type === 'none') {
            const goal = getRandomPlaceOnMap(this.map.getBoundingBox(), this.objList, 500);
            if (!goal) return;
            // console.log('goal', goal, ' dist ', new LV2(goal.x, goal.y).dist(this.person));
            if (!goal) return;
            this.plan = {
                type: 'partial',
                gen: this.constructPlan(goal, 400),
                count: 0,
            };
        } else if (plan.type === 'partial') {
            const rv = plan.gen.next();
            if (rv.done) {
                if (!rv.value) return this.plan = { type: 'none' };
                this.plan = {
                    type: 'following',
                    steps: rv.value,
                };
            } else {
                plan.count++;
                // if (plan.count >= 100) this.plan = { type: 'none' };
            }
        } else {
            const done = !plan.steps.length;
            if (!done) {
                const step = plan.steps.shift();
                this.person.setWalkAnimationLevel(this._t, step.moveToX, step.moveToY, 0, step.facingAngle);
                this._t += 0.1;
            } else {
                this.plan = { type: 'none' };
            }
        }
    }

    // goalPosition: { x: number; y: number }
    *constructPlan(goalPosition, iterationAttempts = 100) {
        const goalPos = new LV2(goalPosition.x, goalPosition.y);
        const start = {
            x: this.person.x,
            y: this.person.y,
            prev: null,
        };
        start.dist = goalPos.dist(start);
        const stack = [start];
        const currentPersonBbox = this.person.getBoundingBox();
        const visited = new Map([[`${start.x},${start.y}`, true]]);
        function recordState(state) {
            const key = `${state.x},${state.y}`;
            state.key = key;
            visited.set(key, true);
        }
        let tries = 0;
        while(stack.length) {
            for(let i = 0; i < iterationAttempts && stack.length; i++) {
                const stepSize = 2;
                // get nextState from stack
                const current = stack.shift();
                // recordState(current);
                if (!current) continue;
                const dist = goalPos.dist(current);
                // console.log(dist);
                // console.log('D', dist);
                // while not reached goal
                const goalReached = dist < stepSize * 2;
                // if this is goal, return formulated plan
                if (goalReached) {
                    let ptr = current;
                    const list = [];
                    while(ptr) {
                        const detail = {
                            moveToX: ptr.x,
                            moveToY: ptr.y,
                            facingAngle: ptr.angle || 0,
                            animateWalk: true,
                        };
                        list.unshift(detail);
                        ptr = ptr.prev;
                    }
                    // console.log(list);
                    return list;
                }
                // else compute next states which have not been visited
                const otherPositions = this.getSurroundingPositions(current.x, current.y, stepSize)
                    .filter(state => {
                        const key = `${state.x},${state.y}`;
                        state.key = key;
                        if (visited.has(key)) return false;
                        state.dist = goalPos.dist(state);
                        const bbox = new Bbox(state.x-15, state.y-15, 30, 30);
                        if (!bbox.within(this.map.getBoundingBox())) return false;
                        // if (state.dist >= start.dist + 100) return false;
                        // return true;
                        return !bbox.intersectsWithAnyObject(this.objList);
                    })
                    .map(state => {
                        state.prev = current;
                        visited.set(state.key, true);
                        return state;
                    });

                // add them to the stack
                stack.push(...otherPositions);
                stack.sort((a, b) => {
                    return a.dist - b.dist;
                });
            }
            yield tries++;
        }
        return null;
    }

}