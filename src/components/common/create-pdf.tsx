import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";
import { LineByLineNote, GlossaryItem } from "@/types/library";

const styles = StyleSheet.create({
    page: {
        paddingTop: 36,
        paddingBottom: 48,
        paddingHorizontal: 36,
        backgroundColor: '#ffffff',
        fontFamily: 'Helvetica',
        fontSize: 10,
        color: '#1e293b'
    },
    header: {
        marginBottom: 20,
        padding: 16,
        backgroundColor: '#f8fafc',
        borderRadius: 8,
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    badge: {
        fontSize: 8,
        fontWeight: 'bold',
        color: '#0284c7',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginBottom: 4
    },
    title: {
        fontSize: 22,
        fontWeight: "bold",
        marginBottom: 6,
        color: '#0f172a',
        lineHeight: 1.2
    },
    subtitle: {
        fontSize: 10,
        color: '#64748b',
        marginBottom: 8
    },
    divider: {
        borderBottomWidth: 1,
        borderBottomColor: '#cbd5e1',
        marginVertical: 12
    },
    sectionCard: {
        marginBottom: 14,
        padding: 12,
        backgroundColor: '#f8fafc',
        borderRadius: 6,
        borderWidth: 1,
        borderColor: '#e2e8f0',
    },
    mainHeading: {
        fontSize: 16,
        fontWeight: "bold",
        color: '#0369a1',
        marginBottom: 6,
        paddingBottom: 4,
        borderBottomWidth: 1,
        borderBottomColor: '#bae6fd',
        textTransform: 'uppercase',
    },
    subHeading: {
        fontSize: 13,
        fontWeight: "bold",
        marginTop: 10,
        marginBottom: 6,
        color: '#0f766e',
    },
    minorHeading: {
        fontSize: 11,
        fontWeight: "bold",
        marginTop: 8,
        marginBottom: 4,
        color: '#334155',
    },
    paragraph: {
        fontSize: 10,
        lineHeight: 1.55,
        color: '#334155',
        marginBottom: 6
    },
    description: {
        fontSize: 10,
        lineHeight: 1.5,
        color: '#475569',
        fontStyle: 'italic',
        marginBottom: 6
    },
    importantPoints: {
        fontSize: 10,
        fontWeight: "bold",
        color: '#92400e',
        marginBottom: 8,
        marginTop: 6,
        backgroundColor: '#fef3c7',
        padding: 8,
        borderRadius: 4,
        borderLeftWidth: 3,
        borderLeftColor: '#d97706',
        lineHeight: 1.4
    },
    bulletPoint: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 8
    },
    nestedBulletPoint: {
        flexDirection: 'row',
        marginBottom: 4,
        paddingLeft: 20
    },
    bullet: {
        width: 10,
        fontSize: 10,
        color: '#0284c7'
    },
    bulletText: {
        flex: 1,
        fontSize: 10,
        lineHeight: 1.5,
        color: '#334155'
    },
    lineItem: {
        marginBottom: 10,
        padding: 10,
        backgroundColor: '#f8fafc',
        borderRadius: 6,
        borderLeftWidth: 3,
        borderLeftColor: '#0284c7',
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    timestampRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 4
    },
    timestampBadge: {
        fontSize: 9,
        fontWeight: "bold",
        color: '#0284c7',
        backgroundColor: '#e0f2fe',
        paddingHorizontal: 6,
        paddingVertical: 2,
        borderRadius: 4
    },
    itemTitle: {
        fontSize: 11,
        fontWeight: "bold",
        color: '#0f172a',
        marginBottom: 4
    },
    itemExplanation: {
        fontSize: 9.5,
        lineHeight: 1.5,
        color: '#334155',
        marginBottom: 4
    },
    itemFormula: {
        fontSize: 9.5,
        fontFamily: 'Courier',
        color: '#0369a1',
        backgroundColor: '#f0f9ff',
        padding: 6,
        borderRadius: 4,
        borderLeftWidth: 2,
        borderLeftColor: '#38bdf8',
        marginVertical: 4
    },
    speakerQuote: {
        fontSize: 9,
        fontStyle: 'italic',
        color: '#64748b',
        backgroundColor: '#f1f5f9',
        padding: 5,
        borderRadius: 4,
        marginBottom: 4
    },
    glossaryCard: {
        marginBottom: 8,
        padding: 8,
        backgroundColor: '#f8fafc',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#e2e8f0'
    },
    glossaryTerm: {
        fontSize: 10.5,
        fontWeight: 'bold',
        color: '#0f766e',
        marginBottom: 2
    },
    glossaryDef: {
        fontSize: 9.5,
        lineHeight: 1.4,
        color: '#334155'
    },
    footer: {
        position: 'absolute',
        bottom: 18,
        left: 36,
        right: 36,
        textAlign: 'center',
        color: '#94a3b8',
        fontSize: 8,
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        paddingTop: 6
    }
});

export interface NotesPDFProps {
    notes: string;
    title?: string;
    timestamp?: string;
    lineByLineNotes?: LineByLineNote[];
    glossary?: GlossaryItem[];
    includeNotes?: boolean;
    includeLineByLine?: boolean;
    includeGlossary?: boolean;
    includeExamTips?: boolean;
    cramSheetOnly?: boolean;
}

const NotesPDF = ({
    notes,
    title = "Lecture Study Notes",
    timestamp = new Date().toLocaleDateString(),
    lineByLineNotes,
    glossary,
    includeNotes = true,
    includeLineByLine = true,
    includeGlossary = true,
    includeExamTips = true,
    cramSheetOnly = false,
}: NotesPDFProps) => {

    // Cram sheet mode: isolate high-yield formulas and exam tips
    if (cramSheetOnly) {
        const examTipsFromNotes = notes
            .split('\n')
            .filter((l) => l.trim().startsWith('!') || l.trim().toLowerCase().includes('exam') || l.trim().toLowerCase().includes('important'))
            .map((l) => l.replace(/^!\s*/, '').trim());

        return (
            <Document>
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <Text style={styles.badge}>NexusEDU • High-Yield Revision</Text>
                        <Text style={styles.title}>⚡ 5-Minute Exam Cram Sheet</Text>
                        <Text style={styles.subtitle}>{title} • Generated on {timestamp}</Text>
                        <View style={styles.divider} />
                    </View>

                    <Text style={styles.subHeading}>Key Exam Takeaways & Tips</Text>
                    {examTipsFromNotes.length > 0 ? (
                        examTipsFromNotes.map((tip, idx) => (
                            <Text key={idx} style={styles.importantPoints}>⚠️ {tip}</Text>
                        ))
                    ) : (
                        <Text style={styles.paragraph}>Review core formulas and definitions below.</Text>
                    )}

                    {lineByLineNotes && lineByLineNotes.filter(n => n.examTakeaway || n.keyFormulaOrRule).length > 0 && (
                        <View style={{ marginTop: 12 }}>
                            <Text style={styles.subHeading}>Formulas & Rules Breakdown</Text>
                            {lineByLineNotes.filter(n => n.examTakeaway || n.keyFormulaOrRule).map((item, idx) => (
                                <View key={idx} style={styles.lineItem}>
                                    <View style={styles.timestampRow}>
                                        <Text style={styles.itemTitle}>{item.title}</Text>
                                        <Text style={styles.timestampBadge}>[{item.timestamp}]</Text>
                                    </View>
                                    {item.keyFormulaOrRule && (
                                        <Text style={styles.itemFormula}>Formula: {item.keyFormulaOrRule}</Text>
                                    )}
                                    {item.examTakeaway && (
                                        <Text style={styles.importantPoints}>Exam Tip: {item.examTakeaway}</Text>
                                    )}
                                </View>
                            ))}
                        </View>
                    )}

                    <Text
                        style={styles.footer}
                        render={({ pageNumber, totalPages }) =>
                            `NexusEDU Cram Sheet • ${title.substring(0, 40)} • Page ${pageNumber} of ${totalPages}`
                        }
                        fixed
                    />
                </Page>
            </Document>
        );
    }

    return (
        <Document>
            {/* Section 1: Structured Comprehensive Notes */}
            {includeNotes && (
                <Page size="A4" style={styles.page}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.badge}>NexusEDU Smart Notes • Study Booklet</Text>
                        <Text style={styles.title}>{title}</Text>
                        <Text style={styles.subtitle}>Generated on {timestamp} • Comprehensive Lecture Summary</Text>
                        <View style={styles.divider} />
                    </View>

                    {/* Content Parsing */}
                    {notes.split('\n').map((rawLine: string, index: number) => {
                        const line = rawLine.trimEnd();
                        if (!line.trim()) return null;

                        // # Main Heading (with or without **description**)
                        if (line.startsWith('# ')) {
                            const withoutHash = line.replace(/^#\s+/, '').trim();
                            if (withoutHash.includes('**')) {
                                const parts = withoutHash.split('**').filter(Boolean);
                                const heading = parts[0] || "";
                                const desc = parts[1] || "";
                                return (
                                    <View key={index} style={styles.sectionCard}>
                                        <Text style={styles.mainHeading}>{heading.trim()}</Text>
                                        {desc ? <Text style={styles.description}>{desc.trim()}</Text> : null}
                                    </View>
                                );
                            }
                            return (
                                <View key={index} style={styles.sectionCard}>
                                    <Text style={styles.mainHeading}>{withoutHash}</Text>
                                </View>
                            );
                        }

                        // ## Subheading
                        if (line.startsWith('## ')) {
                            const subheading = line.replace(/^##\s+/, '').trim();
                            return (
                                <Text key={index} style={styles.subHeading}>{subheading}</Text>
                            );
                        }

                        // ### Minor Heading
                        if (line.startsWith('### ')) {
                            const minor = line.replace(/^###\s+/, '').trim();
                            return (
                                <Text key={index} style={styles.minorHeading}>{minor}</Text>
                            );
                        }

                        // ! Important Points / Warning
                        if (line.startsWith('! ') || line.startsWith('> ')) {
                            if (!includeExamTips && line.toLowerCase().includes('exam')) return null;
                            const text = line.replace(/^[!>]\s+/, '').trim();
                            return (
                                <Text key={index} style={styles.importantPoints}>⚠️ {text}</Text>
                            );
                        }

                        // Nested Bullet points
                        if (line.match(/^\s{2,}[-*•]/)) {
                            const text = line.replace(/^\s+[-*•]\s+/, '').trim();
                            return (
                                <View key={index} style={styles.nestedBulletPoint}>
                                    <Text style={styles.bullet}>–</Text>
                                    <Text style={styles.bulletText}>{text}</Text>
                                </View>
                            );
                        }

                        // Top-level Bullet points
                        if (line.match(/^[-*•]\s+/)) {
                            const text = line.replace(/^[-*•]\s+/, '').trim();
                            return (
                                <View key={index} style={styles.bulletPoint}>
                                    <Text style={styles.bullet}>•</Text>
                                    <Text style={styles.bulletText}>{text}</Text>
                                </View>
                            );
                        }

                        // Standard paragraph text
                        return (
                            <Text key={index} style={styles.paragraph}>{line.trim()}</Text>
                        );
                    })}

                    <Text
                        style={styles.footer}
                        render={({ pageNumber, totalPages }) =>
                            `NexusEDU Notes • ${title.substring(0, 40)} • Page ${pageNumber} of ${totalPages}`
                        }
                        fixed
                    />
                </Page>
            )}

            {/* Section 2: Line-by-Line Video Breakdown */}
            {includeLineByLine && lineByLineNotes && lineByLineNotes.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <Text style={styles.badge}>NexusEDU Synchronized Audio/Video Transcript Breakdown</Text>
                        <Text style={styles.title}>Line-by-Line Chronological Breakdown</Text>
                        <Text style={styles.subtitle}>Timestamp-indexed explanations, formulas, and instructor dialogue</Text>
                        <View style={styles.divider} />
                    </View>

                    {lineByLineNotes.map((item, idx) => (
                        <View key={idx} style={styles.lineItem}>
                            <View style={styles.timestampRow}>
                                <Text style={styles.itemTitle}>{item.title}</Text>
                                <Text style={styles.timestampBadge}>▶ [{item.timestamp}]</Text>
                            </View>
                            <Text style={styles.itemExplanation}>{item.detailedExplanation}</Text>
                            {item.speakerVerbatim && (
                                <Text style={styles.speakerQuote}>Lecturer: "{item.speakerVerbatim}"</Text>
                            )}
                            {item.keyFormulaOrRule && (
                                <Text style={styles.itemFormula}>Formula/Rule: {item.keyFormulaOrRule}</Text>
                            )}
                            {includeExamTips && item.examTakeaway && (
                                <Text style={styles.importantPoints}>Exam Tip: {item.examTakeaway}</Text>
                            )}
                        </View>
                    ))}

                    <Text
                        style={styles.footer}
                        render={({ pageNumber, totalPages }) =>
                            `NexusEDU Timeline • ${title.substring(0, 40)} • Page ${pageNumber} of ${totalPages}`
                        }
                        fixed
                    />
                </Page>
            )}

            {/* Section 3: Technical Glossary */}
            {includeGlossary && glossary && glossary.length > 0 && (
                <Page size="A4" style={styles.page}>
                    <View style={styles.header}>
                        <Text style={styles.badge}>NexusEDU Technical Reference</Text>
                        <Text style={styles.title}>Key Technical Terms & Glossary</Text>
                        <Text style={styles.subtitle}>Essential domain terminology, definitions & memory hooks</Text>
                        <View style={styles.divider} />
                    </View>

                    {glossary.map((item, idx) => (
                        <View key={idx} style={styles.glossaryCard}>
                            <Text style={styles.glossaryTerm}>{item.term}</Text>
                            <Text style={styles.glossaryDef}>{item.definition}</Text>
                        </View>
                    ))}

                    <Text
                        style={styles.footer}
                        render={({ pageNumber, totalPages }) =>
                            `NexusEDU Glossary • ${title.substring(0, 40)} • Page ${pageNumber} of ${totalPages}`
                        }
                        fixed
                    />
                </Page>
            )}
        </Document>
    );
};

export default NotesPDF;

