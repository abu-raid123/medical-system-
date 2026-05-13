# Huffman Coding - Greedy Algorithms Project

## Project Title
**Greedy Algorithms - Huffman Coding and Compression Ratio**

## Overview
This project implements the Huffman coding algorithm for lossless data compression. It demonstrates the greedy-choice property and optimal substructure of Huffman coding, builds a Huffman tree using a min-heap, and provides detailed compression analysis.

## Files
| File | Description |
|------|-------------|
| `huffman_coding.py` | Main implementation - reads text, builds Huffman tree, encodes/decodes, computes statistics |
| `generate_report.py` | Generates the DOC report with all analysis and proofs |
| `sample_text.txt` | Sample input text file for compression analysis |
| `Huffman_Coding_Report.docx` | Generated DOC report with complete analysis |

## How to Run

### Run the Huffman coding analysis
```bash
python huffman_coding.py                    # Uses sample_text.txt
python huffman_coding.py your_file.txt      # Uses a custom file
```

### Generate the DOC report
```bash
pip install python-docx
python generate_report.py
```

## Requirements
- Python 3.6+
- python-docx (for report generation only)

## What the Program Does
1. **Reads** a text file and computes character frequencies
2. **Builds** a Huffman tree using a min-heap (greedy construction)
3. **Generates** optimal binary codes for each character
4. **Encodes** the file into a compressed bit string
5. **Decodes** the bit string back to the original text
6. **Compares** with fixed-length encoding (8-bit ASCII)
7. **Computes** Shannon entropy and coding efficiency

## Report Contents
- Proof of greedy-choice property and optimal substructure
- Steps of tree construction (min-heap)
- Compression ratio: Huffman bits / fixed-length bits
- Entropy of the source vs. average Huffman code length
- Code table for the top 10 most frequent characters
- Verification that encoding + decoding recovers the original file
