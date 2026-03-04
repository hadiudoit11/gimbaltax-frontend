"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  Trash2, 
  Save, 
  RotateCcw, 
  Globe, 
  ExternalLink,
  Info,
  Loader2
} from "lucide-react";
import type { Jurisdiction } from "@/hooks/api/use-jurisdictions";
import { useUpdateJurisdictionSources } from "@/hooks/api/use-jurisdictions";

interface ResearchSourcesManagerProps {
  jurisdiction: Jurisdiction;
}

export function ResearchSourcesManager({ jurisdiction }: ResearchSourcesManagerProps) {
  const [editedSources, setEditedSources] = useState<string[]>(jurisdiction.research_sources || []);
  const [newSource, setNewSource] = useState("");
  const [hasChanges, setHasChanges] = useState(false);
  
  const updateSourcesMutation = useUpdateJurisdictionSources();

  const handleAddSource = () => {
    if (!newSource.trim()) return;
    
    let url = newSource.trim();
    
    // Auto-prepend https:// if no protocol is provided
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = 'https://' + url;
    }
    
    if (!editedSources.includes(url)) {
      const newSources = [...editedSources, url];
      setEditedSources(newSources);
      setNewSource("");
      setHasChanges(true);
      console.log('[ResearchSourcesManager] Source added, hasChanges set to true');
    }
  };

  const handleRemoveSource = (index: number) => {
    const newSources = editedSources.filter((_, i) => i !== index);
    setEditedSources(newSources);
    setHasChanges(true);
  };

  const handleReset = () => {
    setEditedSources(jurisdiction.research_sources || []);
    setNewSource("");
    setHasChanges(false);
  };

  const handleSave = async () => {
    console.log('[ResearchSourcesManager] Saving research sources for jurisdiction:', jurisdiction.id);
    
    try {
      const result = await updateSourcesMutation.mutateAsync({
        id: jurisdiction.id,
        sources: editedSources
      });
      console.log('[ResearchSourcesManager] Research sources saved successfully');
      setHasChanges(false);
    } catch (error) {
      console.error('[ResearchSourcesManager] Failed to save research sources:', error);
    }
  };

  const getSuggestedSources = () => {
    const suggestions: { [key: string]: string[] } = {
      'federal': [
        'https://www.irs.gov',
        'https://www.dol.gov',
        'https://www.treasury.gov',
        'https://www.ssa.gov'
      ],
      'state': [
        `https://www.tax.${jurisdiction.code?.toLowerCase()}.gov`,
        `https://dol.${jurisdiction.code?.toLowerCase()}.gov`,
        `https://www.${jurisdiction.code?.toLowerCase()}.gov/taxes`,
        `https://www.${jurisdiction.code?.toLowerCase()}.gov/revenue`
      ],
      'local': [
        `https://www.${jurisdiction.code?.toLowerCase()}.gov`,
        `https://tax.${jurisdiction.code?.toLowerCase()}.gov`
      ]
    };
    
    return suggestions[jurisdiction.jurisdiction_type] || [];
  };

  const addSuggestedSource = (url: string) => {
    if (!editedSources.includes(url)) {
      setEditedSources([...editedSources, url]);
      setHasChanges(true);
    }
  };


  return (
    <Card className="gradient-card border-slate-600/50">
      <CardHeader>
        <CardTitle className="flex items-center text-slate-200">
          <Globe className="h-5 w-5 mr-2 text-cyan-400" />
          Research Sources
          {jurisdiction.all_research_sources.length > editedSources.length && (
            <Badge variant="outline" className="ml-2 text-slate-400 border-slate-600">
              +{jurisdiction.all_research_sources.length - editedSources.length} inherited
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        
        {/* Info section */}
        <div className="bg-slate-800/30 p-3 rounded-lg border border-slate-600/30">
          <div className="flex items-start space-x-2">
            <Info className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div className="text-xs text-slate-400">
              <p>Configure URLs for AI research specific to this jurisdiction. These sources will be used for tax configuration discovery and compliance event research.</p>
            </div>
          </div>
        </div>

        {/* Add new source */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={newSource}
            onChange={(e) => setNewSource(e.target.value)}
            placeholder="https://example.gov/taxes"
            className="flex-1 rounded-md border border-slate-600 bg-slate-800 px-3 py-2 text-sm text-slate-200 placeholder-slate-400"
            onKeyDown={(e) => e.key === 'Enter' && handleAddSource()}
          />
          <Button
            onClick={handleAddSource}
            disabled={!newSource.trim()}
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* Current sources */}
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-slate-300">
            Direct Sources ({editedSources.length})
          </h4>
          {editedSources.length === 0 ? (
            <p className="text-sm text-slate-400">No direct research sources configured.</p>
          ) : (
            <div className="space-y-2">
              {editedSources.map((source, index) => (
                <div key={index} className="flex items-center justify-between bg-slate-800/50 p-3 rounded-lg border border-slate-600/30">
                  <div className="flex items-center space-x-3 flex-1">
                    <Globe className="h-4 w-4 text-slate-400" />
                    <span className="text-sm text-slate-300 truncate">{source}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-slate-400 hover:text-cyan-400"
                      onClick={() => window.open(source, '_blank')}
                    >
                      <ExternalLink className="h-3 w-3" />
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveSource(index)}
                    className="p-1 h-auto text-slate-400 hover:text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Inherited sources */}
        {jurisdiction.all_research_sources.length > editedSources.length && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">
              Inherited Sources ({jurisdiction.all_research_sources.length - editedSources.length})
            </h4>
            <div className="space-y-1">
              {jurisdiction.all_research_sources
                .filter(source => !editedSources.includes(source))
                .map((source, index) => (
                  <div key={index} className="flex items-center justify-between bg-slate-800/30 p-2 rounded border border-slate-700/30">
                    <div className="flex items-center space-x-3">
                      <Globe className="h-3 w-3 text-slate-500" />
                      <span className="text-xs text-slate-400 truncate">{source}</span>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-1 h-auto text-slate-500 hover:text-cyan-400"
                      onClick={() => window.open(source, '_blank')}
                    >
                      <ExternalLink className="h-2 w-2" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Suggested sources */}
        {getSuggestedSources().length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-slate-300">Suggested Sources</h4>
            <div className="flex flex-wrap gap-1">
              {getSuggestedSources()
                .filter(suggestion => !jurisdiction.all_research_sources.includes(suggestion))
                .map((suggestion, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => addSuggestedSource(suggestion)}
                    className="text-xs border-slate-600 text-slate-300 hover:border-cyan-500 hover:text-cyan-300"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    {suggestion.replace('https://', '').split('/')[0]}
                  </Button>
                ))}
            </div>
          </div>
        )}

        {/* Action buttons */}
        {hasChanges && (
          <div className="flex space-x-2 pt-4 border-t border-slate-600/30">
            <Button
              onClick={handleSave}
              disabled={updateSourcesMutation.isPending}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              {updateSourcesMutation.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              Save Changes
            </Button>
            <Button
              variant="outline"
              onClick={handleReset}
              disabled={updateSourcesMutation.isPending}
              className="border-slate-600 text-slate-300 hover:border-slate-500"
            >
              <RotateCcw className="h-4 w-4 mr-2" />
              Reset
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}