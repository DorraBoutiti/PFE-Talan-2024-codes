import unittest
import coverage

# Start coverage measurement
cov = coverage.Coverage()
cov.start()

# Discover and run tests
loader = unittest.TestLoader()
tests = loader.discover('.')
testRunner = unittest.runner.TextTestRunner()
result = testRunner.run(tests)

# Stop coverage measurement
cov.stop()
cov.save()

# # Report coverage
# print("\nCoverage Report:\n")
# cov.report()

# Report coverage and show missing lines
print("\nCoverage Report with Missing Lines:\n")
cov.report(show_missing=True)

# Check if there were any test failures
if not result.wasSuccessful():
    exit(1)

