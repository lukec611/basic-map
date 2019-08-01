<a href="https://lukec611.github.io/basic-map/">view here</a>

with WebWorkers...

fn stepForEachNavPerson:
    if hasPlan: execute plan;
    if waiting: do nothing;
    if no-plan: requestPlan;

execute plan:
    worker.sendRequest()

worke.receivePlan for nav-person x:
    setPlanForNavPerson x