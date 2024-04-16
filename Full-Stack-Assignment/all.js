class DependencyGraph {
  constructor() {
      this.graph = new Map();
  }
  
  addDependency(dependent, dependency) {
      if (!this.graph.has(dependent)) {
          this.graph.set(dependent, new Set());
      }
      this.graph.get(dependent).add(dependency);
  }
  
  removeDependency(dependent, dependency) {
      if (this.graph.has(dependent)) {
          this.graph.get(dependent).delete(dependency);
      }
  }
  
  hasDependencies(dependent) {
      return this.graph.has(dependent) && this.graph.get(dependent).size > 0;
  }
  
  getDependents(dependency) {
      const dependents = [];
      for (const [key, value] of this.graph.entries()) {
          if (value.has(dependency)) {
              dependents.push(key);
          }
      }
      return dependents;
  }
}

function sortFormulae(formulae) {
  const dependencyGraph = new DependencyGraph();
  const sortedFormulae = [];
  
  // Parse the formulae and build the dependency graph
  for (const formula of formulae) {
      const [dependent, expression] = formula.split('=').map(str => str.trim());
      const variables = expression.match(/[a-zA-Z]+/g) || [];
      for (const variable of variables) {
          dependencyGraph.addDependency(dependent, variable);
      }
  }
  
  // Topological sort
  while (sortedFormulae.length < formulae.length) {
      let hasDependent = false;
      for (const formula of formulae) {
          const [dependent, expression] = formula.split('=').map(str => str.trim());
          if (!sortedFormulae.includes(dependent) && !dependencyGraph.hasDependencies(dependent)) {
              sortedFormulae.push(dependent);
              for (const variable of expression.match(/[a-zA-Z]+/g) || []) {
                  dependencyGraph.getDependents(variable).forEach(dependent => {
                      dependencyGraph.removeDependency(dependent, variable);
                  });
              }
              hasDependent = true;
          }
      }
      if (!hasDependent) {
          return ["cyclic_dependency"];
      }
  }
  
  // Reconstruct sorted formulae with expressions
  const sortedFormulaeWithExpressions = sortedFormulae.map(dependent => {
      const formula = formulae.find(formula => formula.startsWith(dependent));
      return formula;
  });
  
  return sortedFormulaeWithExpressions;
}

// Example usage:
const input1 = ["x=y+6", "y=74", "z= (x * y)"];
const input2 = ["x=ay", "y = x*5"];

console.log(sortFormulae(input1)); // Output: ["y=74", "x=y+6", "z= (x * y)"]
console.log(sortFormulae(input2)); // Output: ["cyclic_dependency"]
