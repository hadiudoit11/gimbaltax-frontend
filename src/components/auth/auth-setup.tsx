"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Lock, Unlock, Key } from "lucide-react";

export function AuthSetup() {
  const [token, setToken] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem('auth_token');
    if (savedToken) {
      setToken(savedToken);
      setIsAuthenticated(true);
    }
  }, []);

  const handleSetToken = () => {
    if (token.trim()) {
      localStorage.setItem('auth_token', token.trim());
      setIsAuthenticated(true);
    }
  };

  const handleClearToken = () => {
    localStorage.removeItem('auth_token');
    setToken("");
    setIsAuthenticated(false);
  };

  const handleSetDevelopmentToken = () => {
    // Set a development token for testing
    const devToken = "dev-test-token-12345";
    setToken(devToken);
    localStorage.setItem('auth_token', devToken);
    setIsAuthenticated(true);
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center">
          {isAuthenticated ? (
            <Unlock className="h-5 w-5 mr-2 text-green-600" />
          ) : (
            <Lock className="h-5 w-5 mr-2 text-red-600" />
          )}
          Authentication Setup
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {isAuthenticated ? (
          <Alert>
            <Key className="h-4 w-4" />
            <AlertDescription>
              Authentication token is set. API requests will include Bearer authentication.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert>
            <AlertDescription>
              No authentication token found. API requests may fail with 401 errors.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-2">
          <label className="text-sm font-medium">API Token</label>
          <input
            type="password"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            placeholder="Enter your API token..."
            className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          />
        </div>

        <div className="flex space-x-2">
          <Button onClick={handleSetToken} disabled={!token.trim()}>
            Set Token
          </Button>
          {isAuthenticated && (
            <Button variant="outline" onClick={handleClearToken}>
              Clear Token
            </Button>
          )}
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground mb-2">Development Mode:</p>
          <Button 
            variant="secondary" 
            size="sm" 
            onClick={handleSetDevelopmentToken}
            className="w-full"
          >
            Use Development Token
          </Button>
        </div>

        <div className="text-xs text-muted-foreground">
          <p>Current token status: {isAuthenticated ? "Set" : "Not set"}</p>
          {isAuthenticated && (
            <p>Token preview: {token.substring(0, 10)}...</p>
          )}
        </div>
      </CardContent>
    </Card>
  );
}