import { memo, useState } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Checkbox from '@mui/material/Checkbox';
import ButtonGroup from '@mui/material/ButtonGroup';
import Typography from '@mui/material/Typography';
import { Tooltip, Divider, Chip, Collapse, Stack, IconButton, Box } from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import HomeIcon from '@mui/icons-material/Home';
import CodeIcon from '@mui/icons-material/Code';
import ShieldIcon from '@mui/icons-material/Security';
import PublicIcon from '@mui/icons-material/Public';
import { ImagingModalitiesMetadata } from '../utils/types';
import { modalitiesDataTypeColorMapping } from '../utils/constants';

// Local mock type to avoid touching production types.ts
export interface MockResultType {
    nodeName: string;
    datasetUUID: string;
    datasetName: string;
    datasetPortalURI: string;
    datasetTotalSubjects: number;
    numMatchingSubjects: number;
    recordsProtected: boolean;
    imageModals: string[];
    pipelines: { [key: string]: string[] };
    // New Fields
    authors: string[];
    homepage: string | null;
    references_and_links: string[];
    keywords: string[];
    repository_url: string | null;
    access_instructions: string | null;
    access_type: 'open' | 'protected' | 'controlled' | null;
    access_email: string | null;
    access_link: string | null;
}

const MockResultCard = memo(
    ({
        data,
        imagingModalitiesMetadata,
        checked,
        onCheckboxChange,
    }: {
        data: MockResultType;
        imagingModalitiesMetadata: ImagingModalitiesMetadata;
        checked: boolean;
        onCheckboxChange: (id: string) => void;
    }) => {
        const [isExpanded, setIsExpanded] = useState(false);

        const {
            nodeName,
            datasetUUID,
            datasetName,
            datasetTotalSubjects,
            numMatchingSubjects,
            recordsProtected,
            imageModals,
            pipelines,
            // Destructure new fields
            authors,
            homepage,
            references_and_links,
            keywords,
            repository_url,
            access_instructions,
            access_type,
            access_email,
            access_link,
        } = data;

        // Helper to render access icon
        const renderAccessIcon = () => {
            if (!access_type) return null;
            let Icon = LockIcon;
            let title = "Protected Class - Login/DUA Required";

            if (access_type === 'open') {
                Icon = LockOpenIcon;
                title = "Open Access";
            } else if (access_type === 'controlled') {
                Icon = FactCheckIcon;
                title = "Controlled Access - Application Required";
            }

            return (
                <Tooltip title={title}>
                    <Icon color="action" fontSize="small" />
                </Tooltip>
            );
        };

        const renderNodeModeIcon = () => {
            const isProtected = recordsProtected;
            // protected -> Shield (Security), public -> Globe (Public)
            const Icon = isProtected ? ShieldIcon : PublicIcon;
            const title = isProtected ? "Records Protected" : "Public Node";

            return (
                <Tooltip title={title}>
                    <Icon color="action" fontSize="small" />
                </Tooltip>
            );
        };

        const renderRepoIcon = () => {
            return (
                <Tooltip title={repository_url ? "Repository" : "No repository available"}>
                    <span>
                        <IconButton
                            size="small"
                            disabled={!repository_url}
                            color="primary"
                            {...(repository_url ? { href: repository_url, target: "_blank", rel: "noopener noreferrer" } : {})}
                        >
                            <CodeIcon fontSize="small" />
                        </IconButton>
                    </span>
                </Tooltip>
            );
        }


        return (
            <Card data-cy={`mock - card - ${datasetUUID} `} sx={{ mb: 2 }}>
                {/* HEADER: Node Name + Access/Repo Icons */}
                <Box sx={{
                    bgcolor: 'grey.100',
                    px: 2,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderBottom: '1px solid',
                    borderColor: 'divider'
                }}>
                    <Typography variant="subtitle2" component="span" fontWeight="bold">
                        {nodeName} node
                    </Typography>
                    {renderNodeModeIcon()}
                    {renderAccessIcon()}
                    {renderRepoIcon()}
                </Box>

                <CardContent>
                    {/* MAIN CONTENT GRID */}
                    <div className="grid grid-cols-12 gap-4">

                        {/* COL 1: Info (Checkbox + Desc) - Span 5 */}
                        <div className="col-span-5 flex gap-2">
                            <Checkbox
                                data-cy={`card - ${datasetUUID} -checkbox`}
                                checked={checked}
                                onChange={() => onCheckboxChange(datasetUUID)}
                                sx={{ p: 0.5, alignSelf: 'flex-start' }}
                            />
                            <Stack spacing={0.5}>
                                {/* Dataset Name (Text Only) */}
                                <Typography variant="h6" component="div" sx={{ lineHeight: 1.2 }}>
                                    {datasetName}
                                </Typography>

                                {/* Authors (First 3) */}
                                <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                    {authors.length > 0
                                        ? authors.slice(0, 3).join(', ') + (authors.length > 3 ? ' et al.' : '')
                                        : 'No authors listed'}
                                </Typography>

                                {/* Actions Row */}
                                <div className="flex items-center gap-1 mt-1">
                                    <Tooltip title={homepage ? "Homepage" : "No Homepage available"}>
                                        <span>
                                            <IconButton
                                                size="small"
                                                disabled={!homepage}
                                                color="primary"
                                                style={{ padding: 4 }}
                                                {...(homepage ? { href: homepage, target: "_blank", rel: "noopener noreferrer" } : {})}
                                            >
                                                <HomeIcon fontSize="medium" />
                                            </IconButton>
                                        </span>
                                    </Tooltip>

                                    <Button
                                        variant="outlined"
                                        size="small"
                                        onClick={() => setIsExpanded(!isExpanded)}
                                        sx={{ textTransform: 'none', px: 2, minWidth: 'auto', height: 28 }}
                                    >
                                        {isExpanded ? "Hide Details" : "Details"}
                                    </Button>
                                </div>
                            </Stack>
                        </div>

                        {/* COL 2: Subjects - Span 3 */}
                        <div className="col-span-3 flex flex-col justify-center">
                            <Typography variant="body2" fontWeight="bold">
                                Matching subjects:
                            </Typography>
                            <Typography variant="h6">
                                {numMatchingSubjects} / {datasetTotalSubjects}
                            </Typography>
                        </div>

                        {/* COL 3: Modalities - Span 2 */}
                        <div className="col-span-2 flex flex-wrap gap-1 content-center justify-center">
                            {imageModals.length > 0 ? (
                                <ButtonGroup>
                                    {imageModals
                                        .sort()
                                        .filter((modal) => {
                                            const metadata = imagingModalitiesMetadata[modal];
                                            return Boolean(metadata?.DataType && metadata?.Abbreviation);
                                        })
                                        .map((modal) => {
                                            const metadata = imagingModalitiesMetadata[modal]!;
                                            const dataType = metadata.DataType;
                                            const backgroundColor =
                                                dataType && modalitiesDataTypeColorMapping[dataType.toLowerCase()];
                                            return (
                                                <Button
                                                    key={modal}
                                                    variant="contained"
                                                    disableElevation
                                                    sx={{
                                                        backgroundColor: backgroundColor ? `${backgroundColor} !important` : undefined,
                                                        '&:hover': {
                                                            backgroundColor: backgroundColor ? `${backgroundColor} !important` : undefined,
                                                            cursor: 'default',
                                                        },
                                                        padding: '2px 8px', // Slightly smaller padding for compact look
                                                        minWidth: 'auto'
                                                    }}
                                                >
                                                    {metadata.Abbreviation ?? metadata.Label ?? modal}
                                                </Button>
                                            );
                                        })}
                                </ButtonGroup>
                            ) : (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic" align="center">
                                    No imaging modalities available
                                </Typography>
                            )}
                        </div>

                        {/* COL 4: Processed (Pipelines) - Span 2 */}
                        <div className="col-span-2 flex justify-end items-center">
                            {Object.entries(pipelines).length > 0 ? (
                                <Tooltip
                                    title={
                                        <Typography variant="body1">
                                            {Object.entries(pipelines)
                                                .flatMap(([name, versions]) =>
                                                    versions.map((version) => `${name.split('/').slice(-1)[0]} ${version}`)
                                                )
                                                .map((pipeline) => (
                                                    <Divider key={pipeline}>{pipeline}</Divider>
                                                ))}
                                        </Typography>
                                    }
                                    placement="top"
                                >
                                    <Button
                                        variant="contained"
                                        color="primary"
                                        sx={{ textTransform: 'none' }}
                                        disableElevation
                                    >
                                        Processed
                                    </Button>
                                </Tooltip>
                            ) : (
                                <Typography variant="body2" color="text.secondary" fontStyle="italic" align="center">
                                    No derivative data available
                                </Typography>
                                // <Tooltip
                                //     title={
                                //         <Typography variant="body1">
                                //             No derivative data available
                                //         </Typography>
                                //     }
                                //     placement="top"
                                // >
                                //     <span>
                                //         <Button
                                //             variant="contained"
                                //             disabled
                                //             sx={{ textTransform: 'none' }}
                                //             disableElevation
                                //         >
                                //             Unprocessed
                                //         </Button>
                                //     </span>
                                // </Tooltip>
                            )}
                        </div>
                    </div>

                    {/* EXPANDABLE DETAILS SECTION */}
                    <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                        <Divider sx={{ my: 2 }} />
                        <Stack spacing={2}>
                            {/* Keywords */}
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Keywords
                                </Typography>
                                {keywords.length > 0 ? (
                                    <div className="flex flex-wrap gap-1">
                                        {keywords.map(k => (
                                            <Chip key={k} label={k} size="small" />
                                        ))}
                                    </div>
                                ) : (
                                    <Typography variant="body2" color="text.disabled" fontStyle="italic">
                                        No keywords available
                                    </Typography>
                                )}
                            </Box>

                            {/* Full Authors */}
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Authors
                                </Typography>
                                {authors.length > 0 ? (
                                    <Typography variant="body2">
                                        {authors.join(', ')}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="text.disabled" fontStyle="italic">
                                        No authors listed
                                    </Typography>
                                )}
                            </Box>

                            {/* Access Instructions */}
                            <Box>
                                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                    Access
                                </Typography>
                                {access_instructions ? (
                                    <Typography variant="body2" paragraph>
                                        {access_instructions}
                                    </Typography>
                                ) : (
                                    <Typography variant="body2" color="text.disabled" fontStyle="italic" paragraph>
                                        No access instructions
                                    </Typography>
                                )}

                                <div className="flex gap-2">
                                    {access_link && (
                                        <Button
                                            variant="outlined"
                                            disableElevation
                                            size="small"
                                            href={access_link}
                                            target="_blank"
                                            startIcon={<OpenInNewIcon />}
                                        >
                                            Access Data
                                        </Button>
                                    )}
                                    {access_email && (
                                        <Button
                                            variant="outlined"
                                            size="small"
                                            href={`mailto:${access_email} `}
                                        >
                                            Contact For Access
                                        </Button>
                                    )}
                                </div>
                            </Box>
                            {/* References */}
                            {references_and_links.length > 0 && (
                                <Box>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        References
                                    </Typography>
                                    <Stack spacing={0.5}>
                                        {references_and_links.map((link, idx) => (
                                            <Typography key={idx} variant="body2" sx={{ wordBreak: 'break-all' }}>
                                                <a href={link} target="_blank" rel="noopener noreferrer">
                                                    {link}
                                                </a>
                                            </Typography>
                                        ))}
                                    </Stack>
                                </Box>
                            )}

                        </Stack>
                    </Collapse>

                </CardContent>
            </Card >
        )
    }
);

export default MockResultCard;
