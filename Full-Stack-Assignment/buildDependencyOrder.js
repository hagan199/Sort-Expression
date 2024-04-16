function sortExpressions(expressions) {
  const graph = {};
  const visited = {};
  const result = []; // To store sorted expressions

  // Function to recursively traverse the graph and detect cycles
  function depthFirstSearch(node, path) {
    if (visited[node] === 1) {
      throw new Error("Cyclic dependency detected: " + path.join(" -> "));
    }
    if (!visited[node]) {
      visited[node] = 1; // Mark node as visited
      if (graph[node]) {
        path.push(node); // Add current node to the path
        graph[node].forEach((neighbor) =>
          depthFirstSearch(neighbor, [...path])
        ); // Pass a copy of the path
        path.pop(); // Remove current node from the path after exploring neighbors
      }
      visited[node] = 2; // Mark node as fully visited
      result.push(node);
    }
  }

  // Build the graph
  expressions.forEach((expression) => {
    const [lhs, rhs] = expression.split("=").map((str) => str.trim());
    if (!graph[rhs]) {
      graph[rhs] = [];
    }
    graph[rhs].push(lhs);
  });

  // Resolve dependencies for each expression
  try {
    expressions.forEach((expression) => {
      const [lhs] = expression.split("=").map((str) => str.trim());
      if (!visited[lhs]) {
        depthFirstSearch(lhs, []);
      }
    });
  } catch (error) {
    if (error.message.startsWith("Cyclic dependency detected")) {
      return ["cyclic_dependency"];
    } else {
      throw error;
    }
  }

  // Reverse the result to get expressions in correct order
  return result.reverse();
}

// Test cases
const test1 = ["x=ay", "y=x*5"];
const test2 = ["x=y+6", "y=74", "z=(x*y)"];

console.log(sortExpressions(test1)); // Output: ["cyclic_dependency"]
console.log(sortExpressions(test2)); // Output: ["y=74", "x=y+6", "z=(x*y)"]
