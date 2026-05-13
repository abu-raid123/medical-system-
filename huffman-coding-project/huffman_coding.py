"""
Huffman Coding - Greedy Algorithm Implementation
=================================================
This program implements Huffman coding for lossless data compression.
It reads a text file, builds a Huffman tree, encodes and decodes the text,
and computes compression statistics including compression ratio and entropy.
"""

import heapq
import math
import os
import sys
from collections import Counter


# ---------------------------------------------------------------------------
# Huffman Tree Node
# ---------------------------------------------------------------------------

class HuffmanNode:
    """Represents a node in the Huffman tree."""

    def __init__(self, char=None, freq=0, left=None, right=None):
        self.char = char
        self.freq = freq
        self.left = left
        self.right = right

    def __lt__(self, other):
        return self.freq < other.freq

    def is_leaf(self):
        return self.left is None and self.right is None


# ---------------------------------------------------------------------------
# Step 1 - Compute Character Frequencies
# ---------------------------------------------------------------------------

def compute_frequencies(text):
    """Return a Counter mapping each character to its frequency."""
    return Counter(text)


# ---------------------------------------------------------------------------
# Step 2 - Build Huffman Tree (min-heap / greedy construction)
# ---------------------------------------------------------------------------

def build_huffman_tree(freq_map):
    """Build and return the root of the Huffman tree using a min-heap."""
    if not freq_map:
        return None

    heap = [HuffmanNode(char=ch, freq=f) for ch, f in freq_map.items()]
    heapq.heapify(heap)

    construction_steps = []
    step_number = 0

    if len(heap) == 1:
        node = heapq.heappop(heap)
        root = HuffmanNode(freq=node.freq, left=node)
        heapq.heappush(heap, root)
        construction_steps.append({
            "step": 1,
            "merged": (repr(node.char), None),
            "new_freq": root.freq,
            "heap_size": len(heap),
        })

    while len(heap) > 1:
        step_number += 1
        left = heapq.heappop(heap)
        right = heapq.heappop(heap)
        merged = HuffmanNode(freq=left.freq + right.freq, left=left, right=right)
        heapq.heappush(heap, merged)

        left_label = repr(left.char) if left.is_leaf() else f"Internal({left.freq})"
        right_label = repr(right.char) if right.is_leaf() else f"Internal({right.freq})"

        construction_steps.append({
            "step": step_number,
            "merged": (left_label, right_label),
            "new_freq": merged.freq,
            "heap_size": len(heap),
        })

    return heap[0], construction_steps


# ---------------------------------------------------------------------------
# Step 3 - Generate Binary Codes
# ---------------------------------------------------------------------------

def generate_codes(root, prefix="", code_map=None):
    """Traverse the Huffman tree and return a dict mapping char -> binary code."""
    if code_map is None:
        code_map = {}
    if root is None:
        return code_map
    if root.is_leaf():
        code_map[root.char] = prefix if prefix else "0"
        return code_map
    generate_codes(root.left, prefix + "0", code_map)
    generate_codes(root.right, prefix + "1", code_map)
    return code_map


# ---------------------------------------------------------------------------
# Step 4 - Encode and Decode
# ---------------------------------------------------------------------------

def encode(text, code_map):
    """Encode the text into a binary string using the Huffman code table."""
    return "".join(code_map[ch] for ch in text)


def decode(encoded_bits, root):
    """Decode a binary string back to the original text using the Huffman tree."""
    if root is None:
        return ""
    if root.is_leaf():
        return root.char * len(encoded_bits)

    decoded_chars = []
    current = root
    for bit in encoded_bits:
        current = current.left if bit == "0" else current.right
        if current.is_leaf():
            decoded_chars.append(current.char)
            current = root
    return "".join(decoded_chars)


# ---------------------------------------------------------------------------
# Step 5 - Compression Statistics
# ---------------------------------------------------------------------------

def compute_statistics(text, code_map, freq_map):
    """Compute compression ratio, entropy, and average code length."""
    total_chars = len(text)
    fixed_bits_per_char = 8  # ASCII
    fixed_total_bits = total_chars * fixed_bits_per_char

    huffman_total_bits = sum(freq_map[ch] * len(code_map[ch]) for ch in freq_map)

    compression_ratio = huffman_total_bits / fixed_total_bits if fixed_total_bits else 0

    # Shannon entropy  H = -sum(p_i * log2(p_i))
    entropy = 0.0
    for ch, freq in freq_map.items():
        p = freq / total_chars
        if p > 0:
            entropy -= p * math.log2(p)

    avg_code_length = huffman_total_bits / total_chars if total_chars else 0

    return {
        "total_chars": total_chars,
        "unique_chars": len(freq_map),
        "fixed_bits_per_char": fixed_bits_per_char,
        "fixed_total_bits": fixed_total_bits,
        "huffman_total_bits": huffman_total_bits,
        "compression_ratio": compression_ratio,
        "space_saving": 1 - compression_ratio,
        "entropy": entropy,
        "avg_code_length": avg_code_length,
    }


# ---------------------------------------------------------------------------
# Display Helpers
# ---------------------------------------------------------------------------

def display_char(ch):
    """Return a readable representation of a character."""
    if ch == " ":
        return "SPACE"
    if ch == "\n":
        return "NEWLINE"
    if ch == "\t":
        return "TAB"
    return ch


def print_report(freq_map, code_map, stats, construction_steps, verification_ok):
    """Print a detailed console report."""
    print("=" * 70)
    print("        HUFFMAN CODING - COMPRESSION ANALYSIS REPORT")
    print("=" * 70)

    # --- Top 10 most frequent characters ---
    print("\n--- Code Table: Top 10 Most Frequent Characters ---\n")
    print(f"{'Rank':<6} {'Char':<10} {'Freq':<8} {'Prob':<10} {'Huffman Code':<20} {'Bits':<6}")
    print("-" * 60)
    sorted_chars = sorted(freq_map.items(), key=lambda x: x[1], reverse=True)
    for rank, (ch, freq) in enumerate(sorted_chars[:10], 1):
        prob = freq / stats["total_chars"]
        code = code_map[ch]
        print(f"{rank:<6} {display_char(ch):<10} {freq:<8} {prob:<10.4f} {code:<20} {len(code):<6}")

    # --- Construction steps (first 15 + last 5) ---
    print("\n--- Huffman Tree Construction Steps (Min-Heap) ---\n")
    total_steps = len(construction_steps)
    if total_steps <= 20:
        steps_to_show = construction_steps
    else:
        steps_to_show = construction_steps[:15]
        steps_to_show.append({"step": "...", "merged": ("...", "..."), "new_freq": "...", "heap_size": "..."})
        steps_to_show.extend(construction_steps[-5:])

    print(f"{'Step':<6} {'Merged Nodes':<45} {'New Freq':<12} {'Heap Size':<10}")
    print("-" * 73)
    for s in steps_to_show:
        left, right = s["merged"]
        merged_str = f"{left} + {right}" if right else str(left)
        print(f"{str(s['step']):<6} {merged_str:<45} {str(s['new_freq']):<12} {str(s['heap_size']):<10}")

    # --- Compression statistics ---
    print("\n--- Compression Statistics ---\n")
    print(f"  Total characters         : {stats['total_chars']}")
    print(f"  Unique characters        : {stats['unique_chars']}")
    print(f"  Fixed-length bits (ASCII): {stats['fixed_total_bits']} bits  ({stats['fixed_bits_per_char']} bits/char)")
    print(f"  Huffman encoded bits     : {stats['huffman_total_bits']} bits")
    print(f"  Compression ratio        : {stats['compression_ratio']:.4f}  ({stats['compression_ratio']*100:.2f}%)")
    print(f"  Space saving             : {stats['space_saving']*100:.2f}%")

    print(f"\n  Shannon Entropy (H)      : {stats['entropy']:.4f} bits/symbol")
    print(f"  Avg Huffman code length  : {stats['avg_code_length']:.4f} bits/symbol")
    print(f"  Efficiency (H / L_avg)   : {(stats['entropy']/stats['avg_code_length']*100) if stats['avg_code_length'] else 0:.2f}%")

    # --- Verification ---
    print("\n--- Encoding / Decoding Verification ---\n")
    if verification_ok:
        print("  [PASS] Decoded text matches the original file exactly.")
    else:
        print("  [FAIL] Decoded text does NOT match the original file!")

    print("\n" + "=" * 70)


# ---------------------------------------------------------------------------
# Main
# ---------------------------------------------------------------------------

def main():
    if len(sys.argv) < 2:
        input_file = os.path.join(os.path.dirname(__file__), "sample_text.txt")
    else:
        input_file = sys.argv[1]

    if not os.path.isfile(input_file):
        print(f"Error: File '{input_file}' not found.")
        sys.exit(1)

    with open(input_file, "r", encoding="utf-8") as f:
        text = f.read()

    if not text:
        print("Error: Input file is empty.")
        sys.exit(1)

    print(f"Reading file: {input_file}")
    print(f"File size   : {os.path.getsize(input_file)} bytes\n")

    # Step 1 - Frequencies
    freq_map = compute_frequencies(text)

    # Step 2 - Build tree
    root, construction_steps = build_huffman_tree(freq_map)

    # Step 3 - Generate codes
    code_map = generate_codes(root)

    # Step 4 - Encode & Decode
    encoded_bits = encode(text, code_map)
    decoded_text = decode(encoded_bits, root)
    verification_ok = decoded_text == text

    # Step 5 - Statistics
    stats = compute_statistics(text, code_map, freq_map)

    # Print console report
    print_report(freq_map, code_map, stats, construction_steps, verification_ok)

    # Return data for report generation
    return {
        "text": text,
        "freq_map": freq_map,
        "code_map": code_map,
        "stats": stats,
        "construction_steps": construction_steps,
        "verification_ok": verification_ok,
        "input_file": input_file,
    }


if __name__ == "__main__":
    main()
