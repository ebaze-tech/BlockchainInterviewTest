function longestCommonPrefix(strs) {
  if (!strs.length) return "";

  // Begin with the first string as the prefix
  let prefix = strs[0];

  // Check the prefix with each string in the array
  for (let i = 1; i < strs.length; i++) {
    while (strs[i].indexOf(prefix) !== 0) {
      // Reduce the prefix by one character at a time
      prefix = prefix.slice(0, -1);
      if (!prefix) return ""; // If there is no prefix remaining, this line of code returns an empty string
    }
  }

  return prefix;
}

console.log(longestCommonPrefix(["flower", "flow", "flight"]));
console.log(longestCommonPrefix(["dog", "racecar", "car"]));
