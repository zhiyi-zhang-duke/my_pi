/**
 * Terminal Stats Extension
 *
 * Enhances terminal display with context usage stats, token speed, and branch information.
 */

import type { ExtensionAPI, ExtensionContext } from "@earendil-works/pi-coding-agent";

export default function (pi: ExtensionAPI) {
	let startTime: number | null = null;
	let totalTokens = 0;
	
	// Update stats when agent response starts
	pi.on("before_agent_start", () => {
		startTime = Date.now();
	});
	
	// Update stats when agent response ends
	pi.on("agent_end", () => {
		startTime = null;
	});
	
	// Track token usage from agent responses
	pi.on("token_usage", (event, ctx) => {
		totalTokens += event.tokens;
		
		// Update UI with token stats
		if (ctx.hasUI) {
			updateTerminalStats(ctx);
		}
	});
	
	// Update the terminal display with stats
	function updateTerminalStats(ctx: ExtensionContext) {
		if (!ctx.hasUI) return;
		
		// Get token speed if we have timing data
		let tokenSpeed = "";
		if (startTime && totalTokens > 0) {
			const elapsedMs = Date.now() - startTime;
			const elapsedSeconds = elapsedMs / 1000;
			if (elapsedSeconds > 0) {
				const tokensPerSecond = totalTokens / elapsedSeconds;
				tokenSpeed = ` ${tokensPerSecond.toFixed(1)} tokens/sec`;
			}
		}
		
		// Get context usage information
		const contextInfo = getContextInfo(ctx);
		
		// Get branch information
		const branchInfo = getBranchInfo(ctx);
		
		// Combine all stats
		let statsText = "";
		if (contextInfo || tokenSpeed || branchInfo) {
			statsText = " [";
			
			if (contextInfo) {
				statsText += contextInfo;
			}
			
			if (tokenSpeed) {
				statsText += tokenSpeed;
			}
			
			if (branchInfo) {
				statsText += ` ${branchInfo}`;
			}
			
			statsText += "] ";
		}
		
		// Update the status line
		ctx.ui.setStatus("terminal-stats", statsText);
	}
	
	// Get context usage information (approximate)
	function getContextInfo(ctx: ExtensionContext): string | null {
		// We can approximate context usage by counting messages in the conversation
		const entries = ctx.sessionManager.getBranch();
		const messageCount = entries.filter(entry => entry.type === "message").length;
		
		// For demonstration, we'll show a rough estimate based on message count
		// In a real implementation, this would use actual token counting
		if (messageCount > 0) {
			const maxTokens = 8000; // Approximate max context tokens for most models
			const estimatedTokens = Math.min(maxTokens, messageCount * 100); // Rough estimate
			const percentage = Math.min(100, Math.round((estimatedTokens / maxTokens) * 100));
			return `${percentage}% (${estimatedTokens} tokens)`;
		}
		
		return null;
	}
	
	// Get branch information
	function getBranchInfo(ctx: ExtensionContext): string | null {
		try {
			// Check if there's a branch in the current session
			const sessionFile = ctx.sessionManager.getSessionFile();
			if (sessionFile) {
				// Extract branch name from session file path (simplified)
				const parts = sessionFile.split("/");
				const filename = parts[parts.length - 1];
				const branchName = filename.replace(".json", "");
				
				// Only show branch info if it's not the default/main branch
				if (branchName && branchName !== "main" && branchName !== "default") {
					return `branch: ${branchName}`;
				}
			}
		} catch (error) {
			// If we can't get branch info, don't show an error
		}
		return null;
	}
	
	// Update stats after each turn
	pi.on("turn_end", (event, ctx) => {
		if (ctx.hasUI) {
			updateTerminalStats(ctx);
		}
	});
	
	// Initialize the stats on session start
	pi.on("session_start", (event, ctx) => {
		if (ctx.hasUI) {
			updateTerminalStats(ctx);
		}
	});
	
	// Reset stats on session end
	pi.on("session_end", () => {
		totalTokens = 0;
		startTime = null;
	});
}